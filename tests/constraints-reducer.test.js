
import { createStore } from 'redux';

import { constraints, setConstraints, initialState } from '../src/constraints-reducer';

describe('Store: ConstraintsStore', () => {
  test('initial state', () => {
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
      store.dispatch(setConstraints({ fake: 'constraints' }));

      const state = store.getState();

      expect(state.constraints).toEqual({ fake: 'constraints' });
    });
  });
});
