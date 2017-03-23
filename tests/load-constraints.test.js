
import fetchMock from 'fetch-mock';

import { loadConstraints } from '../src/load-constraints'

import { configureConstraint } from '../src/config';

import * as actions from '../src/constraints-reducer';

describe('ConstraintsService', () => {
  let dispatch;
  let constraintsStore;

  function setup({ needsAuthentication }) {
    dispatch = jest.fn();
    constraintsStore = () => ({ });

    // Mock the action creators
    actions.setConstraints = jest.fn(() => 'setConstraints');

    configureConstraint({
      constraintsUrl: '/api/constraints',
      needsAuthentication,
      dispatch,
      constraintsStore
    });
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('loadConstraints', () => {
    test('200 with authentication', async () => {
      setup({ needsAuthentication: true });

      fetchMock.get('/api/constraints', { fake: 'constraints' }, {
        credentials: 'include'
      });

      const data = await loadConstraints();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('setConstraints');

      expect(actions.setConstraints).toHaveBeenCalledTimes(1);
      expect(actions.setConstraints).toHaveBeenCalledWith({ fake: 'constraints' });
    });

    test('200 without authentication', async () => {
      setup({ needsAuthentication: false });

      fetchMock.get('/api/constraints', { fake: 'constraints' }, {});

      const data = await loadConstraints();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('setConstraints');

      expect(actions.setConstraints).toHaveBeenCalledTimes(1);
      expect(actions.setConstraints).toHaveBeenCalledWith({ fake: 'constraints' });
    });

    test('500', async () => {
      setup({ needsAuthentication: false });

      fetchMock.get('/api/constraints', 500);

      try {
        const data = await loadConstraints();
        fail();
      } catch(response) {
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actions.setConstraints).toHaveBeenCalledTimes(0);
      }
    });
  });
});
