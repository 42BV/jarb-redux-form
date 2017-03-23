// @flow

import type { ConstraintsStore } from './constraints-reducer';

export type Config = {
  // The URL which will provide the constraints over a GET request.
  constraintsUrl: string,

  // Whether or not the 'constraintsUrl' should be called with authentication.
  needsAuthentication: boolean,

  // The dispatch function for the Redux store.
  dispatch: () => void,

  // A function which returns the latests ConstraintsStore from Redux.
  constraintsStore: () => ConstraintsStore
};

let config: Config | null = null;

/**
 * Configures the Constraint libary.
 *
 * @param {Config} The new configuration
 */
export function configureConstraint(c: Config) {
  config = c;
}

/**
 * Either returns the a Config or throws an error when the
 * config is not yet initialized.
 *
 * @returns The Config
 */
export function getConfig(): Config {
  if (config === null) {
    throw new Error('The constraint service is not initialized.');
  } else {
    return config;
  }
}
