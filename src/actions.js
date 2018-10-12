'use strict';

var constants = require('./constants');

/**
 * Runs prior to executing a query.
 *
 * SYNTAX: requestGraphqlData()
 *
 * @returns {Object} - Action
 */
function requestGraphqlData() {
  var action = {
    type: constants.REQUEST_GRAPHQL_DATA
  };
  action[constants.WASP_IDENTIFIER] = true;
  return action;
}

/**
 * Runs if a query is successful.
 *
 * SYNTAX: receiveGraphqlData(payload, status, lastUpdated)
 *
 * @param {any} payload - The data to be sent to the Redux Store
 * @param {number} status - The response object's status code
 * @param {number} [lastUpdated] - Date when the dispatch is executed;
 *    can be optionally passed in for testing purposes, otherwise it is
 *    set to the return value of Date.now() by default
 *
 * @returns {Object} - Action
 */
function receiveGraphqlData(payload, status, lastUpdated) {
  lastUpdated = lastUpdated || Date.now();
  var action = {
    type: constants.RECEIVE_GRAPHQL_DATA,
    payload: payload,
    status: status,
    lastUpdated: lastUpdated
  };
  action[constants.WASP_IDENTIFIER] = true;
  return action;
}

/**
 * Runs if a query returns an error.
 *
 * SYNTAX: receiveGraphqlError(error, status, lastUpdated)
 *
 * @param {string} error - The response object's error message
 * @param {number} status - Currently returns 0
 * @param {number} [lastUpdated] - Date when the dispatch is executed;
 *    can be optionally passed in for testing purposes, otherwise it is
 *    set to the return value of Date.now() by default
 *
 * @returns {Object} - Action
 */
function receiveGraphqlError(error, status, lastUpdated) {
  lastUpdated = lastUpdated || Date.now();
  var action = {
    type: constants.RECEIVE_GRAPHQL_ERROR,
    error: error,
    status: status,
    lastUpdated: lastUpdated
  };
  action[constants.WASP_IDENTIFIER] = true;
  return action;
}

/**
 * Re-initializes state.
 *
 * SYNTAX: clearGraphqlData()
 *
 * @returns {Object} - Action
 */
function clearGraphqlData() {
  var action = {
    type: constants.CLEAR_GRAPHQL_DATA
  };
  action[constants.WASP_IDENTIFIER] = true;
  return action;
}

module.exports = {
  requestGraphqlData: requestGraphqlData,
  receiveGraphqlData: receiveGraphqlData,
  receiveGraphqlError: receiveGraphqlError,
  clearGraphqlData: clearGraphqlData
};
