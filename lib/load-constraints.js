'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadConstraints = loadConstraints;

var _constraintsReducer = require('./constraints-reducer');

var _config = require('./config');

/**
 * Loads the constraints from the back-end.
 *
 * The URL it will send the request to is defined by the 'constraintsUrl'
 * from the Config object. The HTTP method it uses is 'get'.
 *
 * It will also send the credentials if 'needsAuthentication' from
 * the Config object is set to true.
 *
 * The entire response will be written to the Redux ConstraintsStore's
 * constraints key. Whatever the JSON response is will be the constraints.
 *
 *  An example response:
 *
 * ```JSON
 * {
 *   "SuperHero": {
 *     "name": {
 *       "javaType": "java.lang.String",
 *       "types": ["text"],
 *       "required": true,
 *       "minimumLength": null,
 *       "maximumLength": 50,
 *       "fractionLength": null,
 *       "radix": null,
 *       "pattern": null,
 *       "min": null,
 *       "max": null,
 *       "name": "name"
 *     },
 *     "email": {
 *       "javaType": "java.lang.String",
 *       "types": ["email", "text"],
 *       "required": true,
 *       "minimumLength": null,
 *       "maximumLength": 255,
 *       "fractionLength": null,
 *       "radix": null,
 *       "pattern": null,
 *       "min": null,
 *       "max": null,
 *       "name": "email"
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Promise}
 */
function loadConstraints() {
  var _getConfig = (0, _config.getConfig)(),
      constraintsUrl = _getConfig.constraintsUrl,
      needsAuthentication = _getConfig.needsAuthentication,
      dispatch = _getConfig.dispatch;

  var config = needsAuthentication ? { credentials: 'include' } : {};

  return fetch(constraintsUrl, config).then(tryParse).then(function (constraints) {
    dispatch((0, _constraintsReducer.setConstraints)(constraints));
  });
}

// Throw error when not 200 otherwise parse response.
function tryParse(response) {
  if (response.status !== 200) {
    throw response;
  } else {
    return response.json();
  }
}