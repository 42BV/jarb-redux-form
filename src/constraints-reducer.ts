import { Constraints } from './models';

export interface Action {
  type: 'JARB_REDUX_FORM.SET_CONSTRAINTS';
  constraints: Constraints;
}

export const SET_CONSTRAINTS = 'SET_CONSTRAINTS';

export interface ConstraintsStore {
  constraints?: Constraints;
}

export const initialState: ConstraintsStore = {
  constraints: undefined,
};

export function constraints(state: ConstraintsStore = initialState, action: Action): ConstraintsStore {
  switch (action.type) {
    case 'JARB_REDUX_FORM.SET_CONSTRAINTS': {
      return { ...state, constraints: action.constraints };
    }

    default: {
      return state;
    }
  }
}

export function setConstraints(constraints: Constraints): Action {
  return { type: 'JARB_REDUX_FORM.SET_CONSTRAINTS', constraints };
}
