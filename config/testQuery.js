'use strict';

/**
 * FOR TESTING PURPOSES ONLY
 *
 * This function is a duplicate of `query.js` found in `BlackWaspTech/wasp-graphql`
 *    and can be used to test `redux-wasp`'s version of `query.js`
 *
 * As always with duplicated code, don't assume that this function reflects the
 *    parent's newest version.
 */

/**
 * Configures and executes a fetch request.
 *
 * // Base
 * @param {string} url - The url for the intended resource.
 * @param {Object} [init] - The options object
 * // GraphQL
 * @param {string} [init.fields] - The GraphQL fields for the intended query; either fields or body must be supplied
 * @param {string} [init.body] - The body of the request object; either fields or body must be supplied
 * @param {string} [init.variables]
 * // Fetch
 * @param {string} [init.method="POST"]
 * @param {(string|Object)} [init.headers={'Content-Type': 'application/json',Accept: 'application/json'}]
 * // For additional valid arguments, see:
 * // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 *
 * @returns {Promise}
 */

function query(url, init) {
  // Reject if user provided no arguments
  if (!url || typeof url !== 'string') {
    return Promise.reject(
      "Expected a non-empty string for 'url' but received: " + typeof url
    );
  }

  // Reject if user provided an invalid second argument
  if (!init) {
    return Promise.reject(
      "Expected an object or a non-empty string for 'init' but received: " +
        typeof init
    );
  }

  // The user can just pass in a query string directly; however, if they
  //    pass in an object instead, we need to validate the properties.
  if (typeof init !== 'string') {
    // Reject if there's no valid fields or body parameter
    if (
      typeof init !== 'object' ||
      init.constructor === Array ||
      ((!init.fields || typeof init.fields !== 'string') &&
        (!init.body || typeof init.body !== 'string'))
    ) {
      return Promise.reject(
        "Expected a string for 'init.fields' or 'init.body' but received: " +
          typeof init
      );
    }
  }

  try {
    var fetchOptions = configureFetch(init);
  } catch (err) {
    return Promise.reject(err);
  }

  // Reject if something went wrong with building the request
  if (!fetchOptions) {
    return Promise.reject(
      setTypeError(
        'Something went wrong when setting the fetch options: ' +
          JSON.stringify(fetchOptions)
      )
    );
  }

  return fetch(url, fetchOptions);
}
function configureFetch(init) {
  // If the user only provided a query string
  if (typeof init === 'string') {
    var request = {
      method: init.method || 'POST',
      headers: init.headers || {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: init
      })
    };

    // If the user provided an actual configuration object
  } else {
    var request = {
      method: init.method || 'POST',
      headers: init.headers || {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body:
        init.body ||
        JSON.stringify({
          query: init.fields,
          variables: init.variables
        }),
      mode: init.mode,
      credentials: init.credentials,
      cache: init.cache,
      redirect: init.redirect,
      referrer: init.referrer,
      referrerPolicy: init.referrerPolicy,
      integrity: init.integrity,
      keepalive: init.keepalive,
      signal: init.signal
    };
  }

  return request;
}

module.exports = query;
