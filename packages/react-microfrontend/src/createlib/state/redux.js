import { combineReducers, createStore, applyMiddleware } from 'redux';
import { handleActions } from 'redux-actions';
import Shared from '../shared';
import { connect } from 'react-redux';

const sharedState = new Shared('__state__');

const staticReducers = {
  root: (state = {}, action) => state,
};

function configureStore() {
  const store = createStore(createReducer({}))

  store.asyncReducers = {}

  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = handleActions(asyncReducer, {});
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  sharedState.set('connector', connect);
  sharedState.set('store', store);
  return store
}
function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default configureStore;
