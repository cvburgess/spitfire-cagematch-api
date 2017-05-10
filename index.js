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

// Create a match for :matchId
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


///////////////////////////
// VOTES - User required //
///////////////////////////

app.listen(port);
console.log(`Worker listening on :${port}`);
