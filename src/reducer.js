'use strict';

var constants = require('./constants');
var initialState = require('./initialState');

// --------------------
// Polyfill for Object.assign
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
// --------------------

function reducer(state, action) {
  state = state || initialState;

  switch (action.type) {
    case constants.CLEAR_GRAPHQL_DATA:
      return Object.assign({}, state, initialState);

    case constants.REQUEST_GRAPHQL_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });

    case constants.RECEIVE_GRAPHQL_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        didError: false,
        error: null,
        status: action.status,
        data: action.payload,
        lastUpdated: action.lastUpdated
      });

    case constants.RECEIVE_GRAPHQL_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        didError: true,
        error: action.error,
        status: action.status,
        lastUpdated: action.lastUpdated
      });

    default:
      return state;
  }
}

module.exports = reducer;
