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
  votesForMatch(
    matchId: ID!
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
    votesForMatch (root, { matchId }, context) {
      return model.findVotesForMatch({ matchId }, context);
    }
  },

  Mutation: {
    createVote (root, { userId, teamId, matchId }, context) {
      return model.createVote({ userId, teamId, matchId }, context);
    }
  }
};
