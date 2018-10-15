const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require('graphql-tools');
const { resolvers } = require('./mocks');

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

addMockFunctionsToSchema({ schema, preserveResolvers: true });

module.exports = schema;
