'use strict';

const api = require('../index');

const { graphql } = require('graphql');
const schema = require('../_internal/schema');
const mocks = require('../_internal/mocks');

describe('mutation', () => {
  describe('mutations with mock endpoint', () => {
    const fields = `
      mutation {
        upvotePost (postId: 1) {
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
    const mutation = api.mutation;

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

    const upvotePost = mocks.resolvers.Mutation.upvotePost;
    const posts = mocks.data.posts.map(post => {
      // Updating the test results to handle the "authorID" case
      //    When the GraphQL query executes, this gets converted
      //    to a nested object.
      post.author = { id: post.authorId };
      delete post.authorId;
      return post;
    });

    beforeEach(() => {
      fetch.resetMocks();
      fetch.once(upvotePost);
      invoke({ type: '@@init' });
    });

    it('can return data', () => {
      return mutation('any endpoint', 'any string')
        .then(res => res.body)
        .then(upvotePost => {
          const mutatedPost = upvotePost(undefined, { postId: 1 });
          expect(mutatedPost).toBeTruthy();
          expect(mutatedPost.votes).toEqual(posts[0].votes + 1);
          // Reset the mutation
          mutatedPost.votes -= 1;
        });
    });

    it('can perform a valid mutation', () => {
      return mutation('any endpoint', fields)
        .then(res => {
          expect(fetch).toBeCalled();
          expect(res.errors).toBeFalsy();

          const upvotePost = res.body;
          const mutatedPost = upvotePost(undefined, { postId: 1 });

          expect(mutatedPost.votes).toEqual(posts[0].votes + 1);

          const sentFields = JSON.parse(fetch.mock.calls[0][1].body).query;
          return graphql(schema, sentFields);
        })
        .then(res => {
          expect(res.errors).toBeFalsy();
          return res.data;
        })
        .then(data => {
          expect(data.upvotePost.votes).toEqual(posts[0].votes + 2);
          return graphql(schema, fields);
        })
        .then(res => {
          expect(res.errors).toBeFalsy();
          return res.data;
        })
        .then(data => {
          expect(data.upvotePost.votes).toEqual(posts[0].votes + 3);
        });
    });
  });
});
