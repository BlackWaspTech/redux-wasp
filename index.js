'use strict';

var createWaspMiddleware = require('./src/createWaspMiddleware');
var queryWithDispatch = require('./src/queryWithDispatch');
var constants = require('./src/constants');
var reducer = require('./src/reducer');
var initialState = require('./src/initialState');
var actions = require('./src/actions');

module.exports = {
  // Configuration methods
  createWaspMiddleware: createWaspMiddleware,
  // User methods for interacting with GraphQL
  query: queryWithDispatch,
  mutate: queryWithDispatch,
  // Constants
  constants: constants,
  // Reducers & Data
  graphqlReducer: reducer,
  waspGraphqlReducer: reducer,
  initialState: initialState,
  // Action creators
  requestGraphqlData: actions.requestGraphqlData,
  receiveGraphqlData: actions.receiveGraphqlData,
  receiveGraphqlError: actions.receiveGraphqlError,
  clearGraphqlData: actions.clearGraphqlData
};
