'use strict';

const Versioning = require('./lib/versioning');
const Bundle = require('./lib/bundle');
const CoreRuntimeManager = require('./lib/manager');

const defaults = {
  factory: {
    createNewBundle: (definition, manager = void undefined) => new Bundle (manager, definition),
    createManager: (platform, versionManager = new Versioning()) => new CoreRuntimeManager (platform, versionManager)
  }
};

module.exports = {
  VersionManager: Versioning,
  factory: defaults.factory
};
