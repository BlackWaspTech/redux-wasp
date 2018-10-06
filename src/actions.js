'use strict';

var constants = require('./constants');

function requestGraphqlData() {
  var action = {
    type: constants.REQUEST_GRAPHQL_DATA
  };
  action[constants.WASP_IDENTIFIER] = true;
  return action;
}

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
