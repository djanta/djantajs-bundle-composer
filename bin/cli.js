#!/usr/bin/env node --harmony --expose-gc

'use strict';

let { xarg } = require ('../index');

try {

  xarg.createCommand('serve', {
    options: ['help', 'port', 'iface', 'live-project', 'version'],
    description: 'Runs the djantajs development server'
  })
    .createCommand('analyze', {
      options: ['help', 'module'],
      description: 'Analyze the dependency configuration'
    })
    .createCommand('version', {
      description: 'Print the current server and runtime version information'
    })
    .createOption('help', {
      global: true, alias: 'h',
      order: -1,
      description: 'Global helper option'
    })
    .createOption('port', {
      global: false,
      alias: 'p',
      order: 1,
      description: 'Server external binding host port.',
      default: true,
      value: 3000
    })
    .run();
}
catch (ex) {
  /* eslint-disable no-console */
  console.error(ex);
  /* eslint-enable no-console */
}
