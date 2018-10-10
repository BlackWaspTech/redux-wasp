# redux-wasp

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/BlackWaspTech/redux-wasp.svg?branch=master)](https://travis-ci.org/BlackWaspTech/redux-wasp)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/BlackWaspTech/redux-wasp/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<code>
v0.2.0 (beta)
</code>
<br />

Utilize cutting-edge GraphQL APIs without rebuilding your front-end application. Provides additional [Redux](https://redux.js.org/) middleware and methods for querying a GraphQL server.

If you would like to utilize the base methods without any automation, check out [wasp-graphql](https://github.com/BlackWaspTech/wasp-graphql).

## Purpose

[GraphQL - A query language for your API](https://graphql.org/)

Are you considering an alternative to your REST services? Do you find it impractical to migrate away from using Redux _just_ to call a different type of server? Do you want to remain as interoperable as possible with other technologies?

`redux-wasp` provides a thin wrapper over the Fetch API. Utilize `query` and `mutate` just like you would a `fetch` request. Automate sending query results to the Redux store with the provided middleware and reducer.

Requires `fetch` to be in scope.

## Usage

[How to query a GraphQL server.](https://graphql.org/learn/queries/)

### Installation

- via npm: `npm install --save redux-wasp`

- via yarn: `yarn add redux-wasp`

#### Required: `fetch`

There are several ways to include it in your project:

- Modern browsers ([Can I Use It?](https://caniuse.com/#search=fetch))
- [`what-wg-fetch`/ Window.Fetch polyfill](https://github.com/github/fetch)
- [`cross-fetch`](https://github.com/lquixada/cross-fetch)
- [`node-fetch`](https://github.com/bitinn/node-fetch)
- etc.

### Setup

`redux-wasp` provides two methods, `.query()` and `mutate()`, that will work out-of-the-box. However, to automate applying the query results to the Redux store, custom middleware and reducers are required.

### 1) Configure the middleware

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp';

// `createWaspMiddleware` must be invoked before applying it to the store
const waspMiddleware = createWaspMiddleware();
const store = createStore(r, ps, applyMiddleware(waspMiddleware));

// Without a temporary variable...
// const store = createStore(r, ps, applyMiddleware(createWaspMiddleware())
```

If you want to apply the middleware but _without_ utilizing the automatic dispatches, then set the `automate` property to `false`.

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp';

const waspMiddleware = createWaspMiddleware({ automate: false });
const store = createStore(r, ps, applyMiddleware(waspMiddleware));

// Without a temporary variable...
// const store = createStore(r, ps, applyMiddleware(createWaspMiddleware({automate: false}))
```

### 2) Apply the Reducer

```js
// reducers.js
import { graphqlReducer } from 'redux-wasp';

const reducers = combineReducers({
  foobar: graphqlReducer
});

export default reducers;
```

In the event of API collisions, an alternate name has been provided:

```js
// reducers.js
import { waspGraphqlReducer } from 'redux-wasp';

const reducers = combineReducers({
  foobar: waspGraphqlReducer
});

export default reducers;
```

### 3) Import `query` or `mutate` when needed, and use accordingly

`query()` and `mutate()` will now fire custom dispatches that will update the Redux store as needed.

## API

### Quick Reference

```js
import {
  // Configures the package; required if the user wants to utilize state automation
  createWaspMiddleware,

  // Custom reducer; required if the user wants to utilize state automation
  graphqlReducer,
  waspGraphqlReducer // same as graphqlReducer

  // Modify the initial state provided by the reducer
  initialState,

  // Fetches data from an endpoint
  query,
  mutate,

  // Available action constants:
  //    constants.WASP_IDENTIFIER
  //    constants.REQUEST_GRAPHQL_DATA
  //    constants.RECEIVE_GRAPHQL_DATA
  //    constants.RECEIVE_GRAPHQL_ERROR
  //    constants.CLEAR_GRAPHQL_DATA
  constants,

  // Action creators
  requestGraphqlData,
  receiveGraphqlData,
  receiveGraphqlError,
  clearGraphqlData,


} from 'redux-wasp'
```

### **createWaspMiddleware**: `@param {Object} [config]`

Returns a middleware function that connects `redux-wasp` to `store.dispatch()`.

Takes an optional configuration object. If config's `automate` property is set to false, then `redux-wasp` won't fire custom dispatches automatically.

### **graphqlReducer**

Watches for the dispatches sent by the `query()` and `mutate()` methods, and sends applies the results to the Redux store.

### **waspGraphqlReducer**

Same as `graphqlReducer`. Provided under an additional API in the event of name collisions.

### **initialState**

### **query**: `Promise<Response> query(url, init[, callback]);`

- 1st Argument: `@param {string} url`

The resource to be targetted by the XmlHttpRequest. Must be a string.

- 2nd Argument: `@param {(string|Object)} init`

Can be the query string or a full configuration object.

If the user provides a configuration object, they must also include the query string either as a `.fields` property (standard) or on the `.body` property ([JSON parsable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)).

- 3rd Argument: `@param {function} [transform]`

An optional callback function. Can be used to transform the return value of `response.json()` into a more preferred format. **`transform`'s return value is what will be passed to the Redux store.**

Example:

```js
// actionCreators.js
export function queryForMessages(url, fields) {
  return dispatch => {
    const transform = json => json.data.messages;
    return query(url, fields, transform);
  };
}

// Before:
data = {
  data: {
    messages: ['a', 'b', 'c']
  }
};

// After:
data = ['a', 'b', 'c'];
```

### **mutate**: `Promise<Response> mutate(url, init[, callback]);`

- `@param {string} url`

The resource to be targetted by the XmlHttpRequest. Must be a string.

- `@param {(string|Object)} init`

Can be the mutation string or a full configuration object.

If the user provides a configuration object, they must also include the mutation string either as a `.fields` property (standard) or on the `.body` property ([JSON parsable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)).

- 3rd Argument: `@param {function} [transform]`

An optional callback function. Can be used to transform the return value of `response.json()` into a more preferred format. **`transform`'s return value is what will be passed to the Redux store.**

### **requestGraphqlData**: `Object<Action> requestGraphqlData();`

### **receiveGraphqlData**: `Object<Action> receiveGraphqlData(payload, status[, lastUpdated]);`

### **receiveGraphqlError**: `Object<Action> receiveGraphqlError(error, status[, lastUpdated]);`

### **clearGraphqlData**: `Object<Action> clearGraphqlData();`

---

## Contributing

[Read more](CONTRIBUTING.md)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/10323609?v=4" width="100px;"/><br /><sub><b>Denny Temple</b></sub>](https://dentemple.com/)<br />[💻](#code-dentemple "Code") [📖](#documentation-dentemple "Documentation") [💡](#example-dentemple "Examples") [🤔](#ideas-dentemple "Ideas, Planning, & Feedback") [👀](#review-dentemple "Reviewed Pull Requests") [⚠️](#tests-dentemple "Tests") | [<img src="https://avatars2.githubusercontent.com/u/19364468?v=4" width="100px;"/><br /><sub><b>Reynolds A Colon</b></sub>](http://www.realized-technologies.com)<br />[🎨](#design-Rcolon100 "Design") [🤔](#ideas-Rcolon100 "Ideas, Planning, & Feedback") [👀](#review-Rcolon100 "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/23730068?v=4" width="100px;"/><br /><sub><b>kamo31</b></sub>](https://github.com/kamo31)<br />[🤔](#ideas-kamo31 "Ideas, Planning, & Feedback") [👀](#review-kamo31 "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/19240166?v=4" width="100px;"/><br /><sub><b>marceca</b></sub>](https://github.com/marceca)<br />[🤔](#ideas-marceca "Ideas, Planning, & Feedback") [👀](#review-marceca "Reviewed Pull Requests") |
| :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Code of Conduct

Read our Code of Conduct [here](CODE-OF-CONDUCT.md).

## License

Open Sourced under the [MIT License](LICENSE).
