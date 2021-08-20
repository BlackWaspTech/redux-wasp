# redux-wasp

[![npm](https://img.shields.io/npm/v/redux-wasp.svg)](https://www.npmjs.com/package/redux-wasp)
[![Build Status](https://travis-ci.org/BlackWaspTech/redux-wasp.svg?branch=master)](https://travis-ci.org/BlackWaspTech/redux-wasp)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/redux-wasp.svg)](https://www.npmjs.com/package/redux-wasp)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/BlackWaspTech/redux-wasp/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utilize cutting-edge GraphQL APIs within an existing Redux codebase.

Perform GraphQL queries exactly like you would a `fetch` request.

Takes a `url` and an `init` object as input. Returns a Promise containing the results of the request.

```js
// fetch
fetch('/graphql', { body: JSON.stringify({ query: '{ foo { bar baz } }' }) });

// query
import { query } from 'redux-wasp';
query('/graphql', { fields: '{ foo { bar baz } }' });

// Logging the results
fetch(url, init)
  .then(res => res.json())
  .then(json => console.log(json));
query(url, init)
  .then(res => res.json())
  .then(json => console.log(json));
```

Also automates dispatching the results of the above query to the Redux Store (OPTIONAL).

```js
// Apply the reducer
// reducers.js
import { waspGraphqlReducer } from 'redux-wasp';
const reducers = combineReducers({ graphql: waspGraphqlReducer });

// Configure the middleware
import { createWaspMiddleware } from 'redux-wasp';
const waspMiddleware = createWaspMiddleware();
const store = createStore(
  reducers,
  preloadedState,
  applyMiddleware(waspMiddleware)
);
```

New properties will now be added to your redux store. Every `query` and `mutation` executed will update this properties.

```js
// Contents of Redux Store
{
  "foo": { /* ... */ },
  "bar": { /* ... */ },
  "graphql": {
    "isFetching": false,
    "didError": null,
    "status": null,
    "lastUpdated": null,
    "data": null,
    "error": null
  },
}
```

**For the base query and mutation methods without Redux, check out [`wasp-graphql`](https://github.com/BlackWaspTech/wasp-graphql).**

**For additional interoperability with Apollo, check out [`redux-wasp-apollo`](https://github.com/BlackWaspTech/redux-wasp-apollo).**

**For a live, full-stack application showcasing `redux-wasp` in action, visit [The Buzz](https://github.com/BlackWaspTech/the-buzz).**

## Installation

**Install via npm:**

```js
npm install --save redux-wasp
```

**Install via yarn:**

```js
yarn add redux-wasp
```

`redux-wasp` is a micro-library. Only the base methods included in [`wasp-graphql`](https://github.com/BlackWaspTech/wasp-graphql) will be added as a dependency.

Requires `fetch` to be in scope.

**Requires `fetch` to be in scope.**

- Modern browsers ([Can I Use It?](https://caniuse.com/#search=fetch))
- [`what-wg-fetch`/ Window.Fetch polyfill](https://github.com/github/fetch)
- [`cross-fetch`](https://github.com/lquixada/cross-fetch)
- [`node-fetch`](https://github.com/bitinn/node-fetch)
- etc.

**Use**

```js
// ES6 (with Destructuring)
import { query } from 'redux-wasp';

// ES6
import Wasp from 'redux-wasp';
const query = Wasp.query;

// ES5
var Wasp = require('redux-wasp');
var query = Wasp.query;
```

## How It Works

### GraphQL methods

[How to query a GraphQL server.](https://graphql.org/learn/queries/)

Write a string to request data (["fields"](https://graphql.org/learn/queries/#fields)) from a GraphQL endpoint.

Given an example string:

```js
var myFields = `{
  hero {
    name
    friends {
      name
    }
  }
}`;
```

Pass the query string alone as the second argument...

```js
import { query } from 'redux-wasp';
query('/my/url/endpoint', myFields);
```

Or as a property called `fields` for the second argument...

```js
import { query } from 'redux-wasp';

query('/my/url/endpoint', { fields: myFields });
// Any `fetch` init property can be included as well
query('/my/url/endpoint', { fields: myFields, mode: 'no-cors' });
```

Or as part of a fully customized `body` property (ADVANCED).

```js
import { query } from 'redux-wasp';

// Remember that `body` must be a JSON parsable string. Also, many GQL
//    servers will expect fields to be sent under a `body.query` property.
const init = {
  body: JSON.stringify({
    query: myFields
  }),
  credentials: 'include',
  mode: 'same-origin'
};
query('/my/url/endpoint', init);
```

Then, you can unpack the results of query with `.json()`:

```js
import { query } from 'wasp-graphql';

query('/my/url/endpoint', init)
  .then(response => {
    console.log(response.json()); // my data
  })
  .catch(error => {
    console.log(error); // my error
  });
```

[As a thin wrapper over the Fetch API, anything that applies to `fetch` will also apply to `query` as well.](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Variables

[About dynamic arguments](https://graphql.org/learn/queries/#variables)

GraphQL variables can be passed on as a separate property named `variables`.

```js
import { query } from 'redux-wasp';

query(url, { fields: myFields, variables: myVariables });
```

A longer example:

```js
import { query } from 'redux-wasp';

const url = '/api/starwars';
const fields = `
  query HeroNameAndFriends($episode: Episode) {
    hero(episode: $episode) {
      name
      friends {
        name
      }
    }
  }
`;
const variables = {
  episode: 'JEDI'
};

query(url, { fields, variables })
  .then(res => res.json())
  .then(json => {
    console.log(json);
  });

// A custom body property can be used as well
query(url, { body: JSON.stringify({ fields, variables }) }).then(/* ... */);
```

### Redux functionality

`redux-wasp` provides custom middleware to automate sending the results of `query` to the Redux store. This is completely optional.

`redux-wasp` exposes additional methods so that you can utilize your own approach to automation. See the API for more details.

#### Step 1: Apply the reducer

```js
// reducers.js
import { waspGraphqlReducer } from 'redux-wasp';
// Alias: import { graphqlReducer } from 'redux-wasp';

const reducers = combineReducers({
  graphql: waspGraphqlReducer // or graphqlReducer
});
```

#### Step 2: Configure the middleware

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp';

// `createWaspMiddleware` must be invoked before applying it to the store
const waspMiddleware = createWaspMiddleware();
const store = createStore(r, p, applyMiddleware(waspMiddleware));
```

```js
import { createWaspMiddleware } from 'redux-wasp'

// Without a temporary variable...
const store = createStore(r, p, applyMiddleware(createWaspMiddleware())
```

`redux-wasp`'s dispatch automation can be deactivated by passing in `{ automate: false }` as the first argument.

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp';

const waspMiddleware = createWaspMiddleware({ automate: false });

const store = createStore(r, ps, applyMiddleware(waspMiddleware));
```

#### Now, you may use `query` to your heart's content!

Here is the initial state provided by `redux-wasp`:

```js
{
  isFetching: false,
  didError: false,
  status: null,
  lastUpdated: null,
  data: null,
  error: null
}
```

---

## API

### Quick Reference

```js
import {
  // For interacting with a GQL server
  query,
  mutation,

  // For configuration Redux automation
  createWaspMiddleware,
  waspGraphqlReducer,
  graphqlReducer, // An alias for waspGraphqlReducer

  // For interacting with or overwriting
  //    specific parts of redux-wasp
  constants, // Action constants
  initialState, // Gets passed into graphqlReducer
  requestGraphqlData, // Action creator
  requestGraphqlData, // Action creator
  receiveGraphqlError, // Action creator
  clearGraphqlData // Action creator
} from 'redux-wasp';
```

### `createWaspMiddleware([config: Object])`

```js
/**
 * Generates a custom middleware function.  This middleware saves the dispatch function to the
 * current variable environment so that query/mutatate can auto-dispatch actions.
 *
 * SYNTAX: createWaspMiddleware(config)
 *
 * @param {Object} [config] - Optional settings
 * @param {boolean} [config.automate] - Deactivates the ability to auto-dispatch
 *
 * @returns {function} - Returns Redux Middleware
 */

import { createWaspMiddleware } from 'redux-wasp';
```

### `query(url: string, init: string | Object[, transform: function])`

```js
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

import { query } from 'redux-wasp';
```

### `mutation(url: string, init: string | Object[, transform: function])`

Alias for `query`.

### `constants: Object`

```js
/**
 * Action Types
 *
 * var constants = {
 *    WASP_IDENTIFIER: '__WASP__',
 *    REQUEST_GRAPHQL_DATA: 'REQUEST_GRAPHQL_DATA',
 *    RECEIVE_GRAPHQL_DATA: 'RECEIVE_GRAPHQL_DATA',
 *    RECEIVE_GRAPHQL_ERROR: 'RECEIVE_GRAPHQL_ERROR',
 *    CLEAR_GRAPHQL_DATA: 'CLEAR_GRAPHQL_DATA'
 * }
 */

import { constants } from 'redux-wasp';
```

### `initialState: Object`

```js
/**
 * var initialState = {
 *    isFetching: false,
 *    didError: false,
 *    status: null,
 *    lastUpdated: null,
 *    data: null,
 *    error: null
 * }
 */

import { initialState } from 'redux-wasp';
```

### `waspGraphqlReducer(state: Object, action: Object)`

Alias: `graphqlReducer(state: Object, action: Object)`

```js
/**
 * Updates the Redux Store.
 *
 * @param {Object} state - Previous Redux Store
 * @param {Object} action - Description of the changes to be made
 *
 * @returns {Object} - The new state
 */

import { waspGraphqlReducer } from 'redux-wasp';
// Alias: import { graphqlReducer } from 'redux-wasp';
```

### `requestGraphqlData()`

```js
/**
 * Runs prior to executing a query.
 *
 * SYNTAX: requestGraphqlData()
 *
 * @returns {Object} - Action
 */

import { requestGraphqlData } from 'redux-wasp';
```

### `receiveGraphqlData(payload: any, status: number[, lastUpdated: number])`

```js
/**
 * Runs if a query is successful.
 *
 * SYNTAX: receiveGraphqlData(payload, status, lastUpdated)
 *
 * @param {any} payload - The data to be sent to the Redux Store
 * @param {number} status - The response object's status code
 * @param {number} [lastUpdated] - Date when the dispatch is executed;
 *    can be optionally passed in for testing purposes, otherwise it is
 *    set to the return value of Date.now() by default
 *
 * @returns {Object} - Action
 */

import { receiveGraphqlData } from 'redux-wasp';
```

### `receiveGraphqlError(error: string, status: number[, lastUpdated: number])`

```js
/**
 * Runs if a query returns an error.
 *
 * SYNTAX: receiveGraphqlError(error, status, lastUpdated)
 *
 * @param {string} error - The response object's error message
 * @param {number} status - Currently returns 0
 * @param {number} [lastUpdated] - Date when the dispatch is executed;
 *    can be optionally passed in for testing purposes, otherwise it is
 *    set to the return value of Date.now() by default
 *
 * @returns {Object} - Action
 */

import { receiveGraphqlError } from 'redux-wasp';
```

### `clearGraphqlData()`

```js
/**
 * Re-initializes state.
 *
 * SYNTAX: clearGraphqlData()
 *
 * @returns {Object} - Action
 */

import { clearGraphqlData } from 'redux-wasp';
```

---

## Changelog

View it [here](CHANGELOG.md)

## Contributing

[Read more](CONTRIBUTING.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/10323609?v=4" width="100px;"/><br /><sub><b>Denny Temple</b></sub>](https://dentemple.com/)<br /> | [<img src="https://avatars2.githubusercontent.com/u/19364468?v=4" width="100px;"/><br /><sub><b>Reynolds A Colon</b></sub>](https://www.github.com/rcolon100)<br /> | [<img src="https://avatars2.githubusercontent.com/u/23730068?v=4" width="100px;"/><br /><sub><b>kamo31</b></sub>](https://github.com/kamo31)<br /> | [<img src="https://avatars2.githubusercontent.com/u/19240166?v=4" width="100px;"/><br /><sub><b>marceca</b></sub>](https://github.com/marceca)<br /> |
| :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Code of Conduct

Read our Code of Conduct [here](CODE-OF-CONDUCT.md).

## License

Free and Open Source under the [MIT License](LICENSE).
