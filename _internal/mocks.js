const find = require('lodash.find');
const filter = require('lodash.filter');

// example data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Stevens' },
  { id: 2, firstName: 'Steve', lastName: 'Thomas' },
  { id: 3, firstName: 'SteveTom', lastName: 'TomStevenson' }
];

const posts = [
  { id: 0, authorId: 1, title: 'Introduction to GraphQL', votes: 0 },
  { id: 1, authorId: 2, title: 'Welcome to This', votes: 0 },
  { id: 2, authorId: 2, title: 'Advanced This', votes: 5 },
  { id: 3, authorId: 3, title: 'Will This even work', votes: 3 }
];

const data = { authors, posts };

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => find(authors, { id })
  },

  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    }
  },

  Author: {
    posts: author => filter(posts, { authorId: author.id })
  },

  Post: {
    author: post => find(authors, { id: post.authorId })
  }
};

module.exports = {
  resolvers,
  data
};
