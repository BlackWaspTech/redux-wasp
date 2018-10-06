'use strict';

// TODO: require from the npm library instead
var query = require('./_internal/testQuery');
var throwIfMissingDispatch = require('./_internal/throwIfMissingDispatch');

var constants = require('./src/constants');
var reducer = require('./src/reducer');
var initialState = require('./src/initialState');
var actions = require('./src/actions');

module.exports = (function configureAPI() {
  var dispatch = null;

  /**
   * Accepts the Redux store as middleware and saves the dispatch function
   * to the current variable environment. This is needed for query/mutatate/subscribe.
   *
   * Learn more about Redux Middleware:
   * https://redux.js.org/advanced/middleware
   *
   * @param {object} store - The redux store
   * @returns {any} - Run "next(action)" to pass to the next middleware
   */
  function configureWaspMiddleware(store) {
    return function(next) {
      return function(action) {
        dispatch = store.dispatch;
        return next(action);
      };
    };
  }

  /**
   * Returns the variable environment's dispatch method.
   * For testing purposes only.
   */
  function _getSavedDispatch() {
    return dispatch;
  }

  /**
   * Modifies wasp-graphql's query function to fire relevant dispatch objects
   * https://github.com/BlackWaspTech/wasp-graphql
   *
   * @param {string} url - The url for the intended resource
   * @param {Object} [init] - The options object
   * @param {function} [callback] - The user can choose to provide a callback
   *  that transforms the response's data before it reaches the Redux store
   *
   * @returns {Promise}
   */
  function queryWithDispatch(url, init, callback) {
    throwIfMissingDispatch(dispatch);

    // Reject if user provided no arguments
    if (!url || typeof url !== 'string')
      return Promise.reject(
        "Expected a string for 'url' but received: " + typeof url
      );

    // Curry if user provided only a url
    if (init === undefined) return runQuery;

    // Run the results of wasp-graphql's modified fetch request, but add
    //    additional functionality to the Promise chain.
    return runQuery(init, callback);

    function runQuery(init, callback) {
      // Pre-flight action
      dispatch(actions.requestGraphqlData());

      return query(url, init, callback).then(function(res) {
        // Due to the response's streaming nature, it can be .json()'d only once.
        //    Therefore, a clone of the response is created. This is to ensure that
        //    the user continues to receive an object that they're familiar with.
        var clone = res.clone();
        var status = clone.status;
        clone
          .json()
          .then(function(json) {
            if (callback) return callback(json);
            return json;
          })
          .then(
            function(data) {
              dispatch(actions.receiveGraphqlData(data, status));
              return res;
            },
            function(err) {
              var clone = res.clone();
              var status = clone.status;
              dispatch(actions.receiveGraphqlError(err, status));
              return err;
            }
          );
        return res;
      });
    }
  }

  return {
    // Configuration methods
    waspMiddleware: configureWaspMiddleware,
    _getSavedDispatch: _getSavedDispatch,
    // User methods for interacting with GraphQL
    query: queryWithDispatch,
    // Constants
    constants: constants,
    // Reducers & Data
    graphqlReducer: reducer,
    initialState: initialState,
    // Action creators
    requestGraphqlData: actions.requestGraphqlData,
    requestGraphqlData: actions.requestGraphqlData,
    receiveGraphqlError: actions.receiveGraphqlError,
    clearGraphqlData: actions.clearGraphqlData
  };
})();
