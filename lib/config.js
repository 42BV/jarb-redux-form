'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureConstraint = configureConstraint;
exports.getConfig = getConfig;
var config = null;

/**
 * Configures the Constraint libary.
 *
 * @param {Config} The new configuration
 */
function configureConstraint(c) {
  config = c;
}

/**
 * Either returns the a Config or throws an error when the
 * config is not yet initialized.
 *
 * @returns The Config
 */
function getConfig() {
  if (config === null) {
    throw new Error('The constraint service is not initialized.');
  } else {
    return config;
  }
}