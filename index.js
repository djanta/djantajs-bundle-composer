'use strict';

let Project = require('./lib/project');
let Versioning = require('./lib/versioning');
let Bundle = require('./lib/bundle');
let CoreRuntimeManager = require('./lib/manager');
let Platform = require('./lib/platform');

module.exports = {
  Project: Project,
  VersionManager: Versioning,
  factory: {
    createNewBundle: (def, mgr = void undefined) => new Bundle(mgr, def),
    createManager: (p, vm = new Versioning()) => new CoreRuntimeManager(p, vm)
  },
  Platform: Platform
};
