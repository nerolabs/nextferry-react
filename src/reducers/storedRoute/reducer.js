import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  preferredRoute : 14
});

export default function storedRoute(state = initialState, action = {}) {
  switch (action.type) {
    case types.STORED_ROUTE:
    	return state.merge({
    		 preferredRoute : action.id
    	});

    default:
      return state;
  }
}
