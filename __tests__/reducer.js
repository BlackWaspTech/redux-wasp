'use strict';

var constants = require('../src/constants');
var reducer = require('../src/reducer');
var actions = require('../src/actions');
var initialState = require('../src/initialState');

describe('reducer', function() {
  it('should return the initial state', function() {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should default to the current state', function() {
    expect(reducer(initialState, { type: '__FOO_BAR__' })).toEqual(
      initialState
    );
  });

  it('should handle' + constants.REQUEST_GRAPHQL_DATA, function() {
    var testThisAction = {
      type: constants.REQUEST_GRAPHQL_DATA
    };
    var expectedState = Object.assign({}, initialState, { isFetching: true });
    expect(reducer(undefined, testThisAction)).toEqual(expectedState);
  });

  it('should handle ' + constants.RECEIVE_GRAPHQL_DATA, function() {
    var payload = '/foo/bar/';
    var status = 42;
    var lastUpdated = 1;
    var testThisAction = {
      type: constants.RECEIVE_GRAPHQL_DATA,
      payload: payload,
      status: status,
      lastUpdated: lastUpdated
    };
    var expectedState = Object.assign({}, initialState, {
      data: payload,
      status: status,
      lastUpdated: lastUpdated
    });
    expect(reducer(undefined, testThisAction)).toEqual(expectedState);
  });

  it('should handle ' + constants.RECEIVE_GRAPHQL_ERROR, function() {
    var payload = '/foo/bar/';
    var status = 42;
    var lastUpdated = 1;
    var testThisAction = {
      type: constants.RECEIVE_GRAPHQL_ERROR,
      error: payload,
      status: status,
      lastUpdated: lastUpdated
    };
    var expectedState = Object.assign({}, initialState, {
      didError: true,
      error: payload,
      status: status,
      lastUpdated: lastUpdated
    });
    expect(reducer(undefined, testThisAction)).toEqual(expectedState);
  });

  it('should handle ' + constants.CLEAR_GRAPHQL_DATA, function() {
    var differentState = reducer({}, actions.requestGraphqlData());
    var testThisAction = {
      type: constants.CLEAR_GRAPHQL_DATA
    };
    var expectedState = initialState;
    expect(reducer(differentState, testThisAction)).toEqual(expectedState);
  });
});
