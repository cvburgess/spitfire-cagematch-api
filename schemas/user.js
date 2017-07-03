const model = require('../models');

exports.typeDefs = `
  type User {
    userId: ID!
    email: String!
    hasOptedIn: Boolean!
  }
`;

exports.query = `
  user(
    email: String!
  ): User
`;

exports.mutation = `
  createUser(
    email: String!
    hasOptedIn: Boolean
  ): User!
`;

exports.resolvers = {
  Query: {
    user (root, { email }, context) {
      return model.findUser({ email }, context);
    }
  },
  Mutation: {
    createUser (root, { email, hasOptedIn }, context) {
      return model.createUser({ email, hasOptedIn }, context);
    }
  }
};
