'use strict';

const api = require('../index');

const { graphql } = require('graphql');
const schema = require('../config/schema');
const mocks = require('../config/mocks');

describe('query', () => {
  describe('queries with mock endpoint', () => {
    const fields = `
      query getPosts {
        posts {
          id
          title
          votes
          author {
            id
          }
        }
      }
    `;

    const createWaspMiddleware = api.createWaspMiddleware;
    const query = api.query;

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

    const getPosts = mocks.resolvers.Query.posts;
    const posts = getPosts().map(post => {
      // Updating the test results to handle the "authorID" case
      //    When the GraphQL query executes, this gets converted
      //    to a nested object.
      post.author = { id: post.authorId };
      delete post.authorId;
      return post;
    });

    beforeEach(() => {
      fetch.resetMocks();
      fetch.once(posts);
      invoke({ type: '@@init' });
    });

    it('can return data', () => {
      return query('any endpoint', 'any string')
        .then(res => res.body)
        .then(body => {
          expect(body).toBeTruthy();
          expect(Array.isArray(body)).toBe(true);
          expect(body).toEqual(posts);
        });
    });

    it('can reject an invalid query', () => {
      return query('any endpoint', 'not a query, mate')
        .then(res => {
          expect(fetch).toBeCalled();
          const sentFields = JSON.parse(fetch.mock.calls[0][1].body).query;
          expect(res.body).toEqual(posts);
          return graphql(schema, sentFields);
        })
        .then(res => {
          expect(res.error).toBeTruthy;
        });
    });

    it('can perform a valid query', () => {
      return query('any endpoint', fields)
        .then(res => {
          expect(fetch).toBeCalled();
          const sentFields = JSON.parse(fetch.mock.calls[0][1].body).query;
          expect(res.body).toEqual(posts);
          return graphql(schema, sentFields);
        })
        .then(res => res.data)
        .then(data => {
          expect(data).toHaveProperty('posts');
          expect(data.posts).toEqual(posts);
          return graphql(schema, fields);
        })
        .then(res => res.data)
        .then(data => {
          expect(data).toHaveProperty('posts');
          expect(data.posts).toEqual(posts);
        });
    });
  });
});
