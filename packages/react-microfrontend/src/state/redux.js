import { combineReducers, createStore, applyMiddleware } from 'redux';
import { handleActions } from 'redux-actions';
import Shared from './../shared';

import thunk from 'redux-thunk';

const shared = new Shared('__state__');

const staticReducers = {
  root: (state = {}, action) => state
};

function configureStore() {
  const store = createStore(createReducer({}), applyMiddleware(thunk))

  store.asyncReducers = {}

  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = handleActions(asyncReducer, {}) //TODO: initialState
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  shared.set('store', store);
  return store
}
function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default configureStore;
