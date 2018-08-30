# djantajs-compose

[![npm](https://img.shields.io/npm/v/djantajs-compose.svg?style=flat)](https://github.com/djanta/djantajs-compose)
[![npm downloads](https://img.shields.io/npm/dw/djantajs-compose.svg?style=flat)](https://www.npmjs.com/package/djantajs-compose)
[![Build Status](https://travis-ci.org/djanta/djantajs-compose.svg?branch=master)](https://travis-ci.org/djanta/djantajs-compose)
[![Coverage Status](https://coveralls.io/repos/github/djanta/djantajs-compose/badge.svg?branch=master)](https://coveralls.io/github/djanta/djantajs-compose?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/347ec3025adcdf13f7a6/maintainability)](https://codeclimate.com/github/djanta/djantajs-compose/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/347ec3025adcdf13f7a6/test_coverage)](https://codeclimate.com/github/djanta/djantajs-compose/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/djanta/djantajs-compose/badge.svg)](https://snyk.io/test/github/djanta/djantajs-compose)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat)](https://gitter.im/djantajs/djantajs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> djantajs shared command line tool and bundle builder

## Installation

```
$ npm i --save-dev djantajs-compose -S
```

## Usage

Once the `djantajs-compose` package is installed, you can use it by specifying `djantajs` in the [`extends`](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) section of your [ESLint configuration](http://eslint.org/docs/user-guide/configuring).

```js
{
  extends: 'djantajs',
  rules: {
    // Additional, per-project rules...
  }
}
```

### Using the `djantajs-compose` bundle assembly builder

There are several rules in the [`eslint:recommended` ruleset](http://eslint.org/docs/rules/) that style is not opinionated about that you might want to enforce in your project.

To use this coding style in conjunction with ESLint's recommended rule set, extend them both, making sure to list `djantajs` last:

```js
{
  extends: ['eslint:recommended', 'djantajs'],
  rules: {
    // Additional, per-project rules...
  }
}
```

To see how the `djantajs` config compares with `eslint:recommended`, refer to the [source code of `index.js`](https://github.com/djanta/eslint-config-djantajs/blob/master/index.js), which lists every ESLint rule along with whether (and how) it is enforced by the `djantajs` config.

## License
