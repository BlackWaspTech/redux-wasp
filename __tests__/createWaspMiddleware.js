'use strict';

var api = require('../index');

describe('configureWaspMiddleware.js', function() {
  var createWaspMiddleware = api.createWaspMiddleware;

  var store = {
    getState: jest.fn(function() {
      return {};
    }),
    dispatch: jest.fn()
  };
  var next = jest.fn();
  var invoke = function(action) {
    createWaspMiddleware()(store)(next)(action);
  };

  it('passes through an action', function() {
    var action = { type: 'TEST' };
    invoke({ type: 'TEST' });
    expect(next).toHaveBeenCalledWith(action);
  });
});
