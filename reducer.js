'use strict';

var actions = require('./actions');

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
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
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

var initialState = {
  isFetching: false,
  didError: null,
  status: null,
  lastUpdated: null,
  data: null,
  error: null
};

function reducer(state, action) {
  state = state || initialState;

  switch (action.type) {
    case actions.WASP_CLEAR_DATA:
      return Object.assign({}, state, initialState);

    case actions.WASP_REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });

    case actions.WASP_RECEIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        didError: false,
        error: null,
        status: action.status,
        data: action.payload,
        lastUpdated: Date.now()
      });

    case actions.WASP_RECEIVE_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        didError: true,
        error: action.error,
        status: action.status,
        lastUpdated: Date.now()
      });

    default:
      return state;
  }
}

module.exports = reducer;
