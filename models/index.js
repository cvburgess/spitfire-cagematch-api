module.exports = {

  addTeamToMatch ({ matchId, teamId }, { db }) {
    return db.insert({ matchId, teamId }).into('matches_teams')
    .then(() => this.findMatch({ matchId }, { db }));
  },

  closeVoting ({ matchId }, { db }) {
    return db('matches').update({ isVotingOpen: false }).where({ matchId }).returning('*')
    .then(matchData => matchData[0]);
  },

  createMatch ({ date, isVotingOpen }, { db }) {
    return db.insert({ date, isVotingOpen }).into('matches').returning('*')
    .then(matchData => matchData[0]);
  },

  createTeam ({ teamId, logoData, name }, { db }) {
    return db.insert({ logoData, name }).into('teams').returning('*')
    .then(teamData => teamData[0]);
  },

  createUser ({ email, hasOptedIn }, { db }) {
    if (!validator.isEmail(email)) {
      throw new Error(`${email} is not a valid email address`);
    }
    return db.insert({ email, hasOptedIn }).into('users').returning('*')
    .then(userData => userData[0]);
  },

  createVote ({ userId, teamId, matchId }, { db }) {
    return db.insert({ userId, teamId, matchId }).into('votes').returning('*')
    .then(voteData => voteData[0]);
  },

  findMatch ({ matchId }, { db }) {
    return db.select('*').from('matches').where({ matchId })
    .then(matchData => matchData[0]);
  },

  findMatches ({ date }, { db }) {
    return db.select('*').from('matches').modify(queryBuilder => {
      if (date) queryBuilder.where({ date });
    }).orderBy('date', 'desc');
  },

  findTeam ({ teamId }, { db }) {
    return db.select('*').from('teams').where({ teamId })
    .then(teamData => teamData[0]);
  },

  findTeams ({ db }) {
    return db.select('*').from('teams');
  },

  findMatchTeams ({ matchId }, { db }) {
    return db.select('*').from('matches_teams').where({ matchId });
  },

  findVotes ({ matchId, teamId }, { db }) {
    return db.select('*').from('votes').modify(queryBuilder => {
      if (matchId) queryBuilder.where({ matchId });
      if (teamId) queryBuilder.where({ teamId });
    });
  },

  openVoting ({ matchId }, { db }) {
    return db('matches').update({ isVotingOpen: true }).where({ matchId }).returning('*')
    .then(matchData => matchData[0]);
  },

  removeTeamFromMatch ({ matchId, teamId }, { db }) {
    return db('matches_teams').del().where({ matchId, teamId })
    .then(() => this.findMatch({ matchId }, { db }));
  },

  updateTeamLogoData ({ teamId, logoData }, { db }) {
    return db('teams').update({ logoData }).where({ teamId }).returning('*')
    .then(teamData => teamData[0]);
  },

  updateTeamName ({ teamId, name }, { db }) {
    return db('teams').update({ name }).where({ teamId }).returning('*')
    .then(teamData => teamData[0]);
  }

};
