// @flow

import { createStore } from 'redux';

import { constraints, setConstraints, initialState } from '../src/constraints-reducer';
import type { Action } from '../src/constraints-reducer';

describe('Store: ConstraintsStore', () => {
  test('initial state', () => {
    // $FlowFixMe
    const constraintsStore = constraints(undefined, { type: 'FAKE_ACTION' });

    const expected = {
      constraints: undefined
    };

    expect(constraintsStore).toEqual(expected);
  });

  describe('actions', () => {
    let store;

    beforeEach(() => {
      store = createStore(constraints, initialState);
    });

    test('setConstraints', () => {
      const constraints = Object.freeze({
        "Hero": {
          "name": {
            "javaType": "java.lang.String",
            "types": ['text'],
            "required": true,
            "minimumLength": 3,
            "maximumLength": 255,
            "fractionLength": null,
            "radix": null,
            "pattern": null,
            "min": null,
            "max": null,
            "name": "name"
          }
        }
      });

      store.dispatch(setConstraints(constraints));

      const state = store.getState();

      expect(state.constraints).toEqual(constraints);
    });
  });
});
