'use strict';

var constants = require('../src/constants');
var actions = require('../src/actions');

describe('actions', function() {
  it('should create an action to request data', function() {
    var expectedAction = {
      type: constants.REQUEST_GRAPHQL_DATA
    };
    expectedAction[constants.WASP_IDENTIFIER] = true;
    expect(actions.requestGraphqlData()).toEqual(expectedAction);
  });

  it('should create an action to receive data', function() {
    var payload = '/foo/bar/';
    var status = 42;
    var lastUpdated = 1;
    var expectedAction = {
      type: constants.RECEIVE_GRAPHQL_DATA,
      payload: payload,
      status: status,
      lastUpdated: lastUpdated
    };
    expectedAction[constants.WASP_IDENTIFIER] = true;
    expect(actions.receiveGraphqlData(payload, status, lastUpdated)).toEqual(
      expectedAction
    );
  });

  it('should create an action to receive an error', function() {
    var error = '/foo/bar/';
    var status = 42;
    var lastUpdated = 1;
    var expectedAction = {
      type: constants.RECEIVE_GRAPHQL_ERROR,
      error: error,
      status: status,
      lastUpdated: lastUpdated
    };
    expectedAction[constants.WASP_IDENTIFIER] = true;
    expect(actions.receiveGraphqlError(error, status, lastUpdated)).toEqual(
      expectedAction
    );
  });

  it('should create an action to clear data', function() {
    var expectedAction = {
      type: constants.CLEAR_GRAPHQL_DATA
    };
    expectedAction[constants.WASP_IDENTIFIER] = true;
    expect(actions.clearGraphqlData()).toEqual(expectedAction);
  });
});
