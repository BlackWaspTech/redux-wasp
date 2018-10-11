/*eslint no-unused-vars: "error"*/
var dispatch = require('../_internal/dispatch');
var automate = require('../_internal/automate');

/**
 * Accepts the Redux store as middleware and saves the dispatch function
 * to the current variable environment. This is needed for query/mutatate/subscribe.
 *
 * @param {Object} [config] - Optional settings
 * @param {boolean} [config.automate] - Deactivates the use of dispatches by query/mutation/subscribe
 *
 * @returns {any} - Passes on to the next middleware
 */
function createWaspMiddleware(config) {
  if (config && typeof config.automate === 'boolean') {
    automate = config.automate;
  } else {
    automate = true;
  }

  return function(store) {
    return function(next) {
      return function(action) {
        dispatch = store.dispatch;
        return next(action);
      };
    };
  };
}

module.exports = createWaspMiddleware;
