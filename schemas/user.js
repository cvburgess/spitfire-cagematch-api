const model = require('../models');

exports.typeDefs = `
  type User {
    userId: ID!
    email: String!
    hasOptedIn: Boolean!
  }
`;

exports.query = ``;

exports.mutation = `
  createUser(
    email: String!
    hasOptedIn: Boolean
  ): User!
`;

exports.resolvers = {
  Mutation: {
    createUser (root, { email, hasOptedIn }, context) {
      return model.createUser({ email, hasOptedIn }, context);
    }
  }
};
