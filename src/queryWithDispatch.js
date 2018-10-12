var dispatch = require('../_internal/dispatch');
var automate = require('../_internal/automate');

// TODO: require from the npm library instead
var query = require('../_internal/testQuery');

/**
 * Provides a thin, GQL-compliant wrapper over the Fetch API.
 *
 * SYNTAX: query(url, init, transform)

 * @param {string} url - The url for the intended resource
 * @param {(string|Object)} init - Can be a string of fields or a configuration object
 * @param {function} transform - The user can choose to provide a callback that transform
 *    the response's data before it reaches the Redux store
 * @param {string} [init.fields] - GQL fields: Will be added to the body of the request
 * @param {string} [init.variables] - GQL variables: Will be added to the body of the request
 * // For additional valid arguments, see the Fetch API:
 * // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 *
 * Default init properties
 * @param {string} [init.method='POST']
 * @param {Object} [init.headers={ 'Content-Type': 'application/json', 'Accept': 'application/json' }]
 *
 * @returns {Promise}
 */
function queryWithDispatch(url, init, transform) {
  if (automate) {
    // Assert that dispatch as been provided
    if (!dispatch || typeof dispatch !== 'function') {
      throw new Error(
        'Cannot find store.dispatch.' +
          "This function requires that redux-wasp's middleware " +
          "be added to redux's createStore() method" +
          'before using it.'
      );
    }

    // Pre-flight action
    dispatch(actions.requestGraphqlData());

    return query(url, init).then(
      function(res) {
        // Due to the response's streaming nature, it can be .json()'d only once.
        //    Therefore, a clone of the response is created. This is to ensure that
        //    the user continues to receive an object that they're familiar with.
        var clone = res.clone();
        var status = clone.status;
        clone
          .json()
          .then(function(json) {
            if (transform) return transform(json);
            return json;
          })
          .then(
            function(data) {
              dispatch(actions.receiveGraphqlData(data, status));
              return res;
            },
            function(err) {
              var clone = res.clone();
              var status = clone.status;
              dispatch(actions.receiveGraphqlError(err, status));
              return err;
            }
          );
        return res;
      },
      function(error) {
        dispatch(actions.receiveGraphqlError(error, 0));
        return Promise.reject(error);
      }
    );
  } else {
    return query(url, init);
  }
}

module.exports = queryWithDispatch;
