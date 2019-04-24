import { createStore, Store } from 'redux';
import {
  constraints,
  setConstraints,
  initialState,
  ConstraintsStore
} from '../src/constraints-reducer';
import { ReadonlyConstraints } from '../src/models';

describe('Store: ConstraintsStore', () => {
  test('initial state', () => {
    // @ts-ignore
    const constraintsStore = constraints(undefined, { type: 'FAKE_ACTION' });

    const expected = {
      constraints: undefined
    };

    expect(constraintsStore).toEqual(expected);
  });

  describe('actions', () => {
    let store: Store<ConstraintsStore>;

    beforeEach(() => {
      // @ts-ignore
      store = createStore(constraints, initialState);
    });

    test('setConstraints', () => {
      const constraints: ReadonlyConstraints = Object.freeze({
        Hero: {
          name: {
            javaType: 'java.lang.String',
            types: ['text'],
            required: true,
            minimumLength: 3,
            maximumLength: 255,
            fractionLength: null,
            radix: null,
            pattern: null,
            min: null,
            max: null,
            name: 'name'
          }
        }
      });

      store.dispatch(setConstraints(constraints));

      const state = store.getState();

      expect(state.constraints).toEqual(constraints);
    });
  });
});
