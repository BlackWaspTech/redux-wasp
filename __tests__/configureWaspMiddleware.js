'use strict';

var api = require('../index');

describe('configureWaspMiddleware.js', function() {
  var waspMiddleware = api.waspMiddleware;
  var _getSavedDispatch = api._getSavedDispatch;
  var query = api.query;

  var store = {
    getState: jest.fn(function() {
      return {};
    }),
    dispatch: jest.fn()
  };
  var next = jest.fn();
  var invoke = function(action) {
    waspMiddleware(store)(next)(action);
  };

  it('throws an error if middleware is not configured', function() {
    function callback() {
      return query('/foo', { fields: 'bar' });
    }
    expect(callback).toThrow(Error);
  });

  it('passes through an action', function() {
    var action = { type: 'TEST' };
    invoke({ type: 'TEST' });
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes dispatch and getState', function() {
    invoke({ type: 'TEST DISPATCH' });
    expect(_getSavedDispatch()).toEqual(store.dispatch);
  });
});
