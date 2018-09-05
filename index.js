'use strict';

let Project = require('./lib/project');
let Versioning = require('./lib/versioning');
let Bundle = require('./lib/bundle');
let ProjectManager = require('./lib/manager');
let Platform = require('./lib/platform');

let commandLineArgs = require('command-line-args');
let commandLineUsage = require('command-line-usage');
let _ = require('lodash');

let CliArgv = require('./xarg/argv');
let CliCommad = require('./xarg/xarg');
let CliBlock = require('./xarg/block');

let cloader = require;

// Create the module internal command registry
module.registry = () => {};

// default qualified constants ...
let defaults = {
  registry: {
    group: [
      new CliBlock('synopsis', { title: 'Synopsis', order: 2 }),
      new CliBlock('epilogue', { title: 'Epilogue', order: 20 }),
      new CliBlock('commands', {
        title: 'Available Commands',
        order: 0,
        render: (context, registry = {}) => {
          return _.defaults({ header: context.title }, {
            content: _.map(registry.command || [], (xarg) => {
              return { name: xarg.name, summary: xarg.description };
            })
          });
        }
      }),
      new CliBlock('global', {
        title: 'Global Options',
        order: 1,
        render: (context, registry = {}) => {
          return _.defaults({ header: context.title }, {
            optionList: _.map(_.filter(registry.argv || [], a => a.isGlobal()),
              argv => argv.toJson())
          });
        }
      })
    ]
  },
  config: {
    name: 'command',
    defaultOption: true
  },
  helper: (xarg = void undefined) => {
    if (_.isNil(xarg)) {
      let block = _.reduce(defaults.registry.group.sort((a, b) => {
        return a.order === b.order ?
          0 :
          a.order < b.order ?
            -1 :
            1;
      }), (stash, a) => stash.concat(a.toJson(defaults.registry)), []);

      /* eslint-disable no-console */
      console.log('%s', commandLineUsage(block || []));
      /* eslint-enable no-console */
    }
    else {
      xarg.usage(defaults.registry || {});
    }
  },
  main: new CliCommad('', {
    run: (command = void undefined, argv = []) => {
      switch (command) {
        case 'help': {
          defaults.helper(argv.length === 0 ?
            void undefined :
            _.find(defaults.registry.command || [], a => a.accept(argv[0])));
          break;
        }
        default: {
          let xarg = _.find(defaults.registry.command || [],
            arg => arg.accept(command));

          if (_.isNil(xarg) || (argv.length > 0 && (!!~argv.indexOf('-h') ||
              !!~argv.indexOf('--help')))) {
            defaults.helper(xarg || undefined);
          }
          else {
            return xarg.execute(argv, command, defaults.registry);
          }
        }
      }
    }
  })
};

let xcommander = () => {
  let origin = {
    configure: (options = {}) => { return origin; },
    createBlock: (name, definition = {}) => {
      let group = new CliBlock(name, definition);
      let reg = defaults.registry.group = defaults.registry.group || [];

      reg.push(group); // register the given argument option group ...
      return origin;
    },
    createOption: (name, definition = {}) => {
      let argv = new CliArgv(name, definition || {});
      let reg = defaults.registry.argv = defaults.registry.argv || [];

      reg.push(argv); // register the given argument option ...
      return origin;
    },
    createCommand: (name, definition) => {
      let command = new CliCommad(name, definition || {});
      let reg = defaults.registry.command = defaults.registry.command ||
        [];

      reg.push(command); // register the given command ...
      return origin;
    },
    run: (argv = process.argv) => {
      argv = argv || process.argv;
      let xarg = commandLineArgs(_.defaults({}, defaults.config), {
        stopAtFirstUnknown: true,
        argv
      });

      // execute the main commander ...
      defaults.main.execute(xarg._unknown || [], xarg.command || xarg.help,
        defaults.registry);
    }
  };

  return origin;
};

module.exports = {
  Project: Project,
  VersionManager: Versioning,
  factory: {
    createBundle: (def, mgr = () => void undefined) => new Bundle(mgr, def),
    createManager: (p, vm = new Versioning()) => new ProjectManager(p, vm)
  },
  xarg: xcommander(),
  Platform: Platform,
  inquirer: {
    get prompt () { return cloader('inquirer'); },
    get autocompletion () { return void undefined; }
  }
};
