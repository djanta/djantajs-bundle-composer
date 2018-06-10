'use strict';

let fs = require('fs');

let options = () => {
  if (process.argv.length > 3 && (process.argv[2] !== '-h' ||
    process.argv[2] !== '--help')) {
    let pargv = process.argv;
    let o = pargv.indexOf('--opts');
    let m = !~o ? 'test/mocha.opts' : pargv[o + 1];

    try {
      let opts = fs.readFileSync(m, 'utf8')
        .replace(/\\\s/g, '%20')
        .split(/\s/).filter(Boolean)
        .map(value => value.replace(/%20/g, ' '));

      process.argv = process.argv.slice(0, 2)
        .concat(opts.concat(process.argv.slice(2)));
    }
    catch (err) {
      // ignore
    }
    process.env.LOADED_MOCHA_OPTS = true;
  }
  else {
    return void undefined;
  }
};

/**
 * Export `options`.
 */
module.exports = options;
