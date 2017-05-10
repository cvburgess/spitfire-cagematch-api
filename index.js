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
  .then(userData => res.json( user ))
  .catch(error => res.status(400).json({ error }));
});

// MATCHES - SK required
// TEAMS - SK required
// VOTES - User required

app.listen(port);
console.log(`Worker listening on :${port}`);
