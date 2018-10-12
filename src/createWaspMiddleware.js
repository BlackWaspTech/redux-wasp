/*eslint no-unused-vars: "error"*/
var dispatch = require('../_internal/dispatch');
var automate = require('../_internal/automate');

/**
 * Generates a custom middleware function.  This middleware saves the dispatch function to the
 * current variable environment so that query/mutatate/subscribe can auto-dispatch actions.
 *
 * SYNTAX: createWaspMiddleware(config)
 *
 * @param {Object} [config] - Optional settings
 * @param {boolean} [config.automate] - Deactivates the ability to auto-dispatch
 *
 * @returns {function} - Returns Redux Middleware
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
