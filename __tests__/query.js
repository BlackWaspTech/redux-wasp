'use strict';

var api = require('../index');

describe('query.js', function() {
  var createWaspMiddleware = api.createWaspMiddleware;
  var query = api.query;

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

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ data: 42 }));
    invoke({ type: '@@init' });
  });

  it('returns a promise on error', function() {
    return query().catch(e => expect(e).toBeTruthy());
  });

  it('rejects if the first argument is invalid', function() {
    return query('').catch(e => expect(e).toBeTruthy());
  });

  it('rejects if the second argument is invalid', function() {
    return query('/foo', '').catch(e => expect(e).toBeTruthy());
  });

  it('catches a null second value', function() {
    return query('/foo', null).catch(e => expect(e).toBeTruthy());
  });

  it('catches an array second value', function() {
    return query('/foo', []).catch(e => expect(e).toBeTruthy());
  });

  it('succeeds when receiving a query string', function() {
    return query('/foo', '{ foo { bar } }').then(res =>
      expect(res).toBeTruthy()
    );
  });

  it('succeeds when receiving a fields prop', function() {
    return query('/foo', { fields: 'bar' }).then(res =>
      expect(res).toBeTruthy()
    );
  });

  it('succeeds when receiving a body prop', function() {
    return query('/foo', { body: 'bar' }).then(res => expect(res).toBeTruthy());
  });

  it('calls an endpoint and return data', function() {
    return query('/foo', { fields: 'bar' })
      .then(res => res.json())
      .then(json => expect(json.data).toBe(42));
  });
});
