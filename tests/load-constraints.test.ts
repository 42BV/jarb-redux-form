import fetchMock from 'fetch-mock';

import { loadConstraints } from '../src/load-constraints';
import { configureConstraint } from '../src/config';
import * as actions from '../src/constraints-reducer';

describe('ConstraintsService', () => {
  let dispatch: VoidFunction;
  let constraintsStore: () => () => actions.ConstraintsStore;

  function setup({ needsAuthentication }: { needsAuthentication: boolean }): void {
    dispatch = jest.fn();
    // @ts-ignore
    constraintsStore = () => ({});

    // Mock the action creators
    spyOn(actions, 'setConstraints').and.returnValue('setConstraints');

    configureConstraint({
      constraintsUrl: '/api/constraints',
      needsAuthentication,
      dispatch,
      // @ts-ignore
      constraintsStore,
    });
  }

  afterEach(() => {
    fetchMock.restore();
  });

  describe('loadConstraints', () => {
    test('200 with authentication', async done => {
      setup({ needsAuthentication: true });

      fetchMock.get(
        '/api/constraints',
        { fake: 'constraints' },
        {
          // @ts-ignore
          credentials: 'include',
        },
      );

      await loadConstraints();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('setConstraints');

      expect(actions.setConstraints).toHaveBeenCalledTimes(1);
      expect(actions.setConstraints).toHaveBeenCalledWith({ fake: 'constraints' });

      done();
    });

    test('200 without authentication', async done => {
      setup({ needsAuthentication: false });

      fetchMock.get('/api/constraints', { fake: 'constraints' }, {});

      await loadConstraints();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('setConstraints');

      expect(actions.setConstraints).toHaveBeenCalledTimes(1);
      expect(actions.setConstraints).toHaveBeenCalledWith({ fake: 'constraints' });

      done();
    });

    test('500', async done => {
      setup({ needsAuthentication: false });

      fetchMock.get('/api/constraints', 500);

      try {
        await loadConstraints();
        done.fail();
      } catch (response) {
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actions.setConstraints).toHaveBeenCalledTimes(0);
        done();
      }
    });
  });
});
