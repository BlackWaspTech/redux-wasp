'use strict';

var actions = require('./actions');

function requestGraphqlData() {
  return {
    type: actions.WASP_REQUEST_DATA
  };
}

function receiveGraphqlData(payload, status) {
  return {
    type: actions.WASP_RECEIVE_DATA,
    payload: payload,
    status: status
  };
}

function receiveGraphqlError(error, status) {
  return {
    type: actions.WASP_RECEIVE_ERROR,
    error: error,
    status: status
  };
}

function clearGraphqlData() {
  return {
    type: actions.WASP_CLEAR_DATA
  };
}

module.exports = {
  requestGraphqlData: requestGraphqlData,
  receiveGraphqlData: receiveGraphqlData,
  receiveGraphqlError: receiveGraphqlError,
  clearGraphqlData: clearGraphqlData
};
