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
 *
 * @param {string} url - The endpoint for the request
 * @param {string} queryFields - The GraphQL query string
 * @param {object} [config] - Additional configuration settings for the fetch request
 *
 * @returns {Promise} - Will be either a response promise or a rejected promise
 *
 * @example
 * // Returns a promise
 * var queryString = '{ users { id username } }'
 * query('/api/users', queryString).then(res => res.json())
 * query('/abc/123', { body: JSON.stringify({query: queryString})}).then(res => res.json())
 * query('/myEndpoint', queryString, { "headers": { "xHeader": "123"}}).then(res => res.json())
 *
 * @example
 * var queryString = '{ users { id username } }'
 * var graphQL = query('/api/graphql') // preloads the url via currying
 * graphQL(queryString).then(res => res.json())
 *
 */

function query(url, queryFields, config) {
  switch (arguments.length) {
    // If User provided no arguments
    case 0:
      return Promise.reject(new TypeError(setTypeError(url, 'url', 'string')));

    // If User provided only a url; this will curry the function so that
    //    the user can "preload" a url for later use
    case 1:
      if (!url)
        return Promise.reject(
          new TypeError(setTypeError(url, 'url', 'string'))
        );
      return setAndRun;

    // If User provided separate arguments for queryFields & config
    default:
      return setAndRun(queryFields, config);
  }

  // --------------------
  /**
   * @param {(string | object)} arguments[0] - Can be the query or the request options
   * @param {object} arguments[1] - The request options
   * @returns {Promise} - Will return a promise object
   *
   */
  function setAndRun() {
    var options;

    // Return early if both inputs are invalid
    if (arguments.length === 0)
      return Promise.reject(
        new TypeError(setTypeError(setAndRun, 'queryFields', 'string'))
      );
    if (!arguments[0] && !arguments[1])
      return Promise.reject(
        new TypeError(setTypeError(queryFields, 'queryFields', 'string'))
      );

    // If User provided only a single argument
    if (!arguments[1]) {
      var param = arguments[0];

      if (typeof param === 'string') {
        // Configure the fetch request
        options = setFetchRequest(param);
      } else if (typeof param === 'object' && typeof param.body === 'string') {
        // Configure the fetch request; then, extend the configuration
        //    with additional settings provided by the user
        options = setFetchRequest();
        options = extendFetchRequest(options, param);
      }
    } else {
      var queryFields = arguments[0];
      var config = arguments[1];

      // Check if a query string exists
      if (
        typeof queryFields !== 'string' &&
        (!config || typeof config.body !== 'string')
      )
        return Promise.reject(
          new TypeError(setTypeError(queryFields, 'queryFields', 'string'))
        );

      // Configure the fetch request; then, extend the configuration
      //    with additional settings provided by the user
      options = setFetchRequest(queryFields);
      options = extendFetchRequest(options, config);
    }

    // The url is supplied here via closure
    // The fetch options are built via the above conditionals
    return fetch(url, options);
  }
}

/**
 * Allows the user to override the fetch configuration
 *      with additional settings.
 *
 * @param {object} original - The request object
 * @param {object} extension - Properties to be added to the request
 *
 * @returns {object} - The amended request
 */

function extendFetchRequest(original, extension) {
  // This is the ES5 version of:
  //    ---> return Object.assign(original, extension)
  for (var prop in extension) {
    original[prop] = extension[prop];
  }

  return original;
}

/**
 * Generates the settings necessary for a successful GraphQL request.
 *
 * @param {string} fields - The GraphQL query
 *
 * @returns {string} - A parsable JSON string
 */

function setFetchRequest(fields) {
  var baseRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };

  if (fields) {
    baseRequest.body = JSON.stringify({
      query: fields
    });
  }

  return baseRequest;
}

/**
 * Creates a custom error message.
 *
 * @param {any} receivedValue
 * @param {string} expectedLabel
 * @param {string} expectedType
 *
 * @returns {string}
 */

function setTypeError(receivedValue, expectedLabel, expectedType) {
  var message = '';
  message += '\n\nEXPECTED ' + expectedLabel;
  message += ' to be a ' + expectedType;
  message += '.\nRECEIVED: ' + JSON.stringify(receivedValue);
  message += ' (' + typeof receivedValue + ')\n\n';
  return message;
}

module.exports = query;
