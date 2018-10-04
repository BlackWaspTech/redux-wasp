'use strict';

// TODO: require from the npm library instead
var query = require('./_internal/testQuery');

var actions = require('./actions');
var reducer = require('./reducer');
var actionCreators = require('./actionCreators');

/**
 * Configures the package; requires the user to run `configureWasp(store)`
 *    before many of the main public methods can be run.
 *
 * This wrapper function allows the store to be saved for later use via closure.
 *
 * @returns {object} - Provides the methods available for public use
 *
 */
module.exports = (function configureAPI() {
  var store = null;

  /**
   * Saves a reference to the Redux Store.
   *
   * @param {object} currentStore - The configured redux store
   *
   * @returns {object} - Passes on the store
   *
   * @example
   * // Takes the configured Redux store as a parameter
   * configureWasp(store)
   *
   * @example
   * // Will pass on the store as a return value
   * export default configureWasp(store)
   *
   * @example
   * // store.js
   * import { createStore } from 'redux'
   * import { configureWasp } from 'redux-wasp'
   * const store = createStore(reducers)
   * export default configureWasp(store)
   */
  function configureWasp(currentStore) {
    store = currentStore;
    return currentStore;
  }

  /**
   * Adds additional functionality to the `.query()` method from `wasp-graphql`.
   *
   * See the `wasp-graphql` docs for additional information:
   * https://github.com/BlackWaspTech/wasp-graphql
   *
   * @param {string} url - The endpoint for the request
   * @param {string} queryFields - The GraphQL query string
   * @param {object} [config] - Additional configuration settings for the fetch request
   * @param {function} [callback] - Allows the user to transform the results of .json() before
   *    it reaches the store; NOTE: This callback should return the response if the user's
   *    intention is to continue chaining .then() calls
   *
   * @returns {Promise} - Passes on either the response or the error object
   *
   * @example
   * var queryString = '{ users { id username } }'
   * query('/api/users', queryString).then(res => res.json())
   *
   * @example
   * var queryString = '{ users { id username } }'
   * var callback = function(res) {
   *    console.log(res)
   *    return res
   * }
   * query('/api/users', queryString)
   */
  function queryWithDispatch() {
    store.dispatch(actionCreators.requestGraphqlData());
    var argsLength = arguments.length;
    if (argsLength > 2 && typeof arguments[argsLength - 1] === 'function') {
      var callback = arguments[argsLength - 1];
    }

    return query.apply(null, arguments).then(function(res) {
      var clone = res.clone();
      var status = clone.status;
      clone
        .json()
        .then(function(json) {
          if (callback) {
            return callback(json);
          }
          return json;
        })
        .then(
          function(data) {
            store.dispatch(actionCreators.receiveGraphqlData(data, status));
            return res;
          },
          function(err) {
            var clone = res.clone();
            var status = clone.status;
            store.dispatch(actionCreators.receiveGraphqlError(err, status));
            return err;
          }
        );
      return res;
    });
  }

  return {
    // Configuration method
    configureWasp: configureWasp,
    // User methods for interacting with a web API
    query: queryWithDispatch,
    // Constants
    actions: actions,
    // Reducer
    graphqlReducer: reducer,
    // Action creators
    requestGraphqlData: actionCreators.requestGraphqlData,
    requestGraphqlData: actionCreators.requestGraphqlData,
    receiveGraphqlError: actionCreators.receiveGraphqlError,
    clearGraphqlData: actionCreators.clearGraphqlData
  };
})();
