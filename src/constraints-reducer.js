// @flow

type Action = {
  type: string,
  payload: any
};

import type { Constraints } from './models';

export const SET_CONSTRAINTS = 'SET_CONSTRAINTS';

export type ConstraintsStore = {
  constraints?: Constraints,
};

export const initialState: ConstraintsStore = {
  constraints: undefined,
};

export function constraints(state: ConstraintsStore = initialState, action: Action): ConstraintsStore {
  switch(action.type) {
    case SET_CONSTRAINTS: {
      return { ...state, constraints: action.payload.constraints };
    }

    default: {
      return state;
    }
  }
}

export function setConstraints(constraints: Constraints): Action {
  return { type: SET_CONSTRAINTS, payload: { constraints } };
}
