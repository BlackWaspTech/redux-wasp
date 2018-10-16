'use strict';

const api = require('../index');

describe('query.js', function() {
  describe('unit tests', () => {
    const fields = '{ foo { bar } }';

    const createWaspMiddleware = api.createWaspMiddleware;
    const query = api.query;

    const store = {
      getState: jest.fn(function() {
        return {};
      }),
      dispatch: jest.fn()
    };
    const next = jest.fn();
    const invoke = function(action) {
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

    it('rejects null values', function() {
      return query('/foo', null).catch(e => expect(e).toBeTruthy());
    });

    it('rejects arrays', function() {
      return query('/foo', []).catch(e => expect(e).toBeTruthy());
    });

    it('can call an endpoint', () => {
      query('/api/ping', fields);

      expect(fetch).toBeCalled();
    });

    it('can pass a query string as part of a request', () => {
      const fetchInit = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ query: fields })
      };
      const url = '/api/ping';

      query(url, fields);
      expect(fetch).toBeCalledWith(url, fetchInit);
    });

    it('succeeds when receiving a query string', function() {
      return query('/foo', fields).then(res => expect(res).toBeTruthy());
    });

    it('succeeds when receiving a fields prop', function() {
      return query('/foo', { fields }).then(res => expect(res).toBeTruthy());
    });

    it('succeeds when receiving a body prop', function() {
      return query('/foo', { body: JSON.stringify({ query: fields }) }).then(
        res => expect(res).toBeTruthy()
      );
    });

    it('calls an endpoint and return data', function() {
      return query('/foo', { fields })
        .then(res => res.json())
        .then(json => expect(json.data).toBe(42));
    });
  });
});
