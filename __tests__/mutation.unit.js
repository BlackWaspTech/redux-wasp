'use strict';

const api = require('../index');

describe('mutation', () => {
  describe('unit tests', () => {
    const fields = '{ foo { bar } }';

    const createWaspMiddleware = api.createWaspMiddleware;
    const mutation = api.mutation;

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
      fetch.once(JSON.stringify({ data: 42 }));
      invoke({ type: '@@init' });
    });

    it('returns a promise on error', () => {
      return mutation().catch(e => {
        expect(e).toBeTruthy();
      });
    });

    it('rejects if the first argument is invalid', () => {
      return mutation('').catch(e => {
        expect(e).toBeTruthy();
      });
    });

    it('rejects if the second argument is invalid', () => {
      return mutation('/foo', '').catch(e => {
        expect(e).toBeTruthy();
      });
    });

    it('rejects null values', () => {
      return mutation('/foo', null).catch(e => {
        expect(e).toBeTruthy();
      });
    });

    it('rejects arrays', () => {
      return mutation('/foo', []).catch(e => {
        expect(e).toBeTruthy();
      });
    });

    it('can call an endpoint', () => {
      mutation('/api/ping', fields);

      expect(fetch).toBeCalled();
    });

    it('can pass a mutation string as part of a request', () => {
      const fetchInit = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ query: fields })
      };
      const url = '/api/ping';

      mutation(url, fields);
      expect(fetch).toBeCalledWith(url, fetchInit);
    });

    it('responds when receiving a mutation string', () => {
      return mutation('/foo', fields).then(res => {
        expect(res).toBeTruthy();
      });
    });

    it('responds when receiving a fields prop', () => {
      return mutation('/foo', { fields }).then(res => {
        expect(res).toBeTruthy();
      });
    });

    it('responds when receiving a body prop', () => {
      return mutation('/foo', { body: fields }).then(res => {
        expect(res).toBeTruthy();
      });
    });

    it('can call an endpoint and return data', () => {
      return mutation('/foo', { fields })
        .then(res => res.json())
        .then(json => {
          expect(json.data).toBe(42);
        });
    });
  });
});
