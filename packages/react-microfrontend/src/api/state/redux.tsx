import React from 'react';
import { combineReducers, createStore as createReduxStore, applyMiddleware } from 'redux';
import { handleActions } from 'redux-actions';
import Shared from '../shared';
import { connect, Provider } from 'react-redux';

const sharedState = new Shared('__state__');

const staticReducers = {
  root: (state = {}, action) => state,
};

function configureStore() {
  const store : any = createReduxStore(createReducer({}))

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
