'use strict';

const Versioning = require('./lib/versioning');
const Bundle = require('./lib/sauce');
const Manager = require('./lib/manager');

module.exports = {
  VersionManager: Versioning,
  factory: {
    createBundleManager: (source, versionManager = new Versioning()) => new Manager (source, versionManager),
    createNewBundle: (definition, manager = void undefined) => new Bundle (manager, definition)
  }
};
