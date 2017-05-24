const model = require('../models');

exports.typeDefs = `
  type Match {
    matchId: ID!
    isVotingOpen: Boolean!
    # TODO: Migrate to date scalar
    date: String
    teams: [Team]
  }
`;

exports.query = `
  match(
    matchId: ID!
  ): Match

  matches(
    date: String
  ): [Match]
`;

exports.mutation = `
  createMatch(
    date: String
    isVotingOpen: Boolean
  ): Match!

  addTeamToMatch(
    teamId: ID!
    matchId: ID!
  ): Match!

  openVoting(
    matchId: ID!
  ): Match!

  closeVoting(
    matchId: ID!
  ): Match!
`;

exports.resolvers = {

  Match: {
    teams ({ matchId }, params, context) {
      return model.findMatchTeams({ matchId }, context)
      .then(matchTeams => matchTeams.map(({ teamId }) => model.findTeam({teamId}, context)));
    }
  },

  Query: {
    match (root, { matchId }, context) {
      return model.findMatch({ matchId }, context);
    },

    matches (root, { date }, context) {
      return model.findMatches({ date }, context);
    }
  },

  Mutation: {
    addTeamToMatch (root, { matchId, teamId }, context) {
      return model.addTeamToMatch({ matchId, teamId }, context);
    },

    createMatch (root, { date, isVotingOpen }, context) {
      return model.createMatch({ date, isVotingOpen }, context);
    },

    openVoting (root, { matchId }, context) {
      return model.openVoting({ matchId }, context);
    },

    closeVoting (root, { matchId }, context) {
      return model.closeVoting({ matchId }, context);
    }
  }

};
