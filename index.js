const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const validator = require('validator');

const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const databaseUrl = process.env.DATABASE_URL;

const app = express();
const db = require('knex')({
  client: 'pg',
  connection: databaseUrl
});

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Unscripted Cagematch API is live'));

// Create new user
app.post('/users', bodyParser.json(), (req, res) => {
  const { email, hasOptedIn } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: `${email} is not a valid email address` });
  }

  return knex.insert({ email, hasOptedIn }).into('users').returning('*')
  .then(userData => res.json(userData[0]))
  .catch(error => res.status(400).json({ error }));
});

///////////////////////////
// MATCHES - SK required //
///////////////////////////

// Create new match
app.post('/matches', bodyParser.json(), (req, res) => {
  const { date, isVotingOpen } = req.body;

  return knex.insert({ date, isVotingOpen }).into('matches').returning('*')
  .then(matchData => res.json(matchData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Get all matches
app.get('/matches', (req, res) => {
  return knex.select('*').from('matches')
  .then(matches => res.json({ matches }))
  .catch(error => res.status(400).json({ error }));
});

// Get match for :matchId
app.get('/matches/:matchId', (req, res) => {
  const { matchId } = req.params;

  return knex.select('*').from('matches').where({ matchId })
  .then(matchData => res.json(matchData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Update match for :matchId
app.put('/matches/:matchId', bodyParser.json(), (req, res) => {
  const { matchId } = req.params;
  const { date, isVotingOpen } = req.body;

  return knex('matches').update({ date, isVotingOpen }).where({ matchId }).returning('*')
  .then(matchData => res.json(matchData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Delete match for :matchId
app.delete('/matches/:matchId', (req, res) => {
  const { matchId } = req.params;

  return knex.del().where({ matchId })
  .then(rowDeleted => res.sendStatus(204))
  .catch(error => res.status(400).json({ error }));
});

/////////////////////////
// TEAMS - SK required //
/////////////////////////

// Create new team
app.post('/teams', bodyParser.json(), (req, res) => {
  const { logoData, name } = req.body;

  return knex.insert({ logoData, name }).into('teams').returning('*')
  .then(teamData => res.json(teamData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Get all teams
app.get('/teams', (req, res) => {
  return knex.select('*').from('teams')
  .then(teams => res.json({ teams }))
  .catch(error => res.status(400).json({ error }));
});

// Get team for :teamId
app.get('/teams/:teamId', (req, res) => {
  const { teamId } = req.params;

  return knex.select('*').from('teams').where({ teamId })
  .then(teamData => res.json(teamData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Update team for :teamId
app.put('/teams/:teamId', bodyParser.json(), (req, res) => {
  const { teamId } = req.params;
  const { logoData, name } = req.body;

  return knex('teams').update({ logoData, name }).where({ teamId }).returning('*')
  .then(teamData => res.json(teamData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Delete team for :teamId
app.delete('/teams/:teamId', (req, res) => {
  const { teamId } = req.params;

  return knex.del().where({ teamId })
  .then(rowDeleted => res.sendStatus(204))
  .catch(error => res.status(400).json({ error }));
});

///////////
// VOTES //
///////////

// Cast a vote
app.post('/votes', bodyParser.json(), (req, res) => {
  const { userId, teamId, matchId } = req.body;

  return knex.insert({ userId, teamId, matchId }).into('votes').returning('*')
  .then(voteData => res.json(voteData[0]))
  .catch(error => res.status(400).json({ error }));
});

// Get all votes for match :matchId
app.get('/votes', (req, res) => {
  const { matchId } = req.query;

  return knex.select('*').from('votes').where({ matchId })
  .then(votes => res.json({ votes }))
  .catch(error => res.status(400).json({ error }));
});

app.listen(port);
console.log(`Worker listening on :${port}`);
