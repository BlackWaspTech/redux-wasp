var dispatch = require('../_internal/dispatch');
var automate = require('../_internal/automate');

// TODO: require from the npm library instead
var query = require('../_internal/testQuery');

/**
 * Modifies wasp-graphql's query function to fire relevant dispatch objects
 * https://github.com/BlackWaspTech/wasp-graphql
 *
 * @param {string} url - The url for the intended resource
 * @param {Object} [init] - The options object
 * @param {function} [transform] - The user can choose to provide a callback
 *  that transforms the response's data before it reaches the Redux store
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
