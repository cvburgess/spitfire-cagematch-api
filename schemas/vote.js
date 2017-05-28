const model = require('../models');

exports.typeDefs = `
  type Vote {
    voteId: ID!
    user: User!
    team: Team!
    match: Match!
  }
`;

exports.query = `
  votes(
    teamId: ID
    matchId: ID
  ): [Vote]
`;

exports.mutation = `
  createVote(
    userId: ID!
    teamId: ID!
    matchId: ID!
  ): Vote!
`;

exports.resolvers = {
  Vote: {
    match ({ matchId }, params, context) {
      return model.findMatch({ matchId }, context);
    },
    team ({ teamId }, params, context) {
      return model.findTeam({ teamId }, context);
    },
    user ({ userId }, params, context) {
      return model.findUser({ userId }, context);
    }
  },

  Query: {
    votes (root, { matchId, teamId }, context) {
      return model.findVotes({ matchId, teamId }, context);
    }
  },

  Mutation: {
    createVote (root, { userId, teamId, matchId }, context) {
      return model.createVote({ userId, teamId, matchId }, context);
    }
  }
};
