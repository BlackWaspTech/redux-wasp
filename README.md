# redux-wasp

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/BlackWaspTech/redux-wasp.svg?branch=master)](https://travis-ci.org/BlackWaspTech/redux-wasp)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/BlackWaspTech/redux-wasp/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **v0.2.0 (beta)**

Utilize cutting-edge GraphQL APIs within existing Redux codebases. Can also automate dispatching the results of a GraphQL query to the Redux Store.

Check out [wasp-graphql](https://github.com/BlackWaspTech/wasp-graphql) for the automation-less version of `query/mutate/subscribe`.

## Installation

Note: Requires `fetch` to be in scope.

**Install via npm:**

```js
npm install --save redux-wasp
```

**Install via yarn:**

```js
yarn add redux-wasp
```

`redux-wasp` is a micro-library. Only the base methods included in [`wasp-graphql`](https://github.com/BlackWaspTech/wasp-graphql) will be added as a dependency.

### Ways to include `fetch`

- Modern browsers ([Can I Use It?](https://caniuse.com/#search=fetch))
- [`what-wg-fetch`/ Window.Fetch polyfill](https://github.com/github/fetch)
- [`cross-fetch`](https://github.com/lquixada/cross-fetch)
- [`node-fetch`](https://github.com/bitinn/node-fetch)
- etc.

## How It Works

### GraphQL-specific methods

[GraphQL - A query language for your API](https://graphql.org/)

Execute a GraphQL `query` just like you would a `fetch` request.

```js
// Fetch API
fetch('/my/url/endpoint', { body: JSON.stringify({ query: 'bar' }) }) // returns a Promise

// redux-wasp
import { query } from 'redux-wasp'
query('/my/url/endpoint', { body: JSON.stringify({ query: 'bar' }) }) // returns a Promise
```

Write a basic string to ask for [specific fields](https://graphql.org/learn/queries/#fields) from a GraphQL API.

Given an example string:

```js
var myFields = `{
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}`
```

Fields can be passed alone as the second argument...

```js
import { query } from 'redux-wasp'
query('/my/url/endpoint', myFields)
```

Or as a `fields` property on the init/configuration object...

```js
import { query } from 'redux-wasp'

query('/my/url/endpoint', { fields: myFields })
// Any `fetch` init property can be included as well
query('/my/url/endpoint', { fields: myFields, mode: 'no-cors' })
```

Or as part of a fully customized `body` property. (ADVANCED)

```js
import { query } from 'redux-wasp'

// Remember that `body` must be a JSON parsable string. Also, many GQL
//    servers will expect fields to be sent under a `body.query` property.
//    GQL variables can be sent under `body.variables`.
const init = {
  body: JSON.stringify({
    query: myFields,
    variables: '{ "name": "Batman" }'
  }),
  credentials: 'include',
  mode: 'same-origin'
}
query('/my/url/endpoint', init)
```

Requires `fetch`.

### Redux-specific functionality

`redux-wasp` provides custom middleware to automate sending the results of `query` to the Redux store. This functionality is completely optional.

`redux-wasp` also exposes many of the methods here so that you can utilize your own approach while maintaining a common API across projects. See API for more details.

#### Step 1: Configure the middleware

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp'

// `createWaspMiddleware` must be invoked before applying it to the store
const waspMiddleware = createWaspMiddleware()
const store = createStore(r, p, applyMiddleware(waspMiddleware))
```

```js
import { createWaspMiddleware } from 'redux-wasp'

// Without a temporary variable...
const store = createStore(r, p, applyMiddleware(createWaspMiddleware())
```

`redux-wasp`'s dispatch automation can be deactivated by passing in `{ automate: false }` as the first argument.

```js
// store.js
import { createWaspMiddleware } from 'redux-wasp'

const waspMiddleware = createWaspMiddleware({ automate: false })

const store = createStore(r, ps, applyMiddleware(waspMiddleware))
```

#### Step 2: Apply the reducer

```js
// reducers.js
import { graphqlReducer } from 'redux-wasp'

const reducers = combineReducers({
  // Can name the property here to whatever you want
  graphql: graphqlReducer
})
```

In the event of API collisions, an alternate name has been provided:

```js
// reducers.js
import { waspGraphqlReducer } from 'redux-wasp'

const reducers = combineReducers({
  graphql: waspGraphqlReducer
})
```

#### Now, you may use `query` to your heart's content!

With the middleware and reducer configured

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

## API

TODO

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
