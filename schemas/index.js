const { makeExecutableSchema } = require('graphql-tools');
const merge = require('merge');

const match = require('./match');
const team = require('./team');
const user = require('./user');
const vote = require('./vote');

const baseTypeDefs = `
  type Query {
    ${match.query}
    ${team.query}
    ${user.query}
    ${vote.query}
  }

  type Mutation {
    ${match.mutation}
    ${team.mutation}
    ${user.mutation}
    ${vote.mutation}
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const baseResovers = {
  Query: {},
  Mutation: {}
};

const typeDefs = [
  baseTypeDefs,
  match.typeDefs,
  team.typeDefs,
  user.typeDefs,
  vote.typeDefs
];

const resolvers = merge.recursive(true,
  baseResovers,
  match.resolvers,
  team.resolvers,
  user.resolvers,
  vote.resolvers
);

module.exports = makeExecutableSchema({ typeDefs, resolvers });
