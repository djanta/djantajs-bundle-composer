'use strict';

/**
 * Exporting the builder context function
 * @param {string} type the given builder type
 */
module.exports.newBuilder = (type) => {
  switch (type) {
    case 'command':
    case 'xarg':
    break;
    case 'block':
    break;
    // Skip default
  }
};
