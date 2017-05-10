const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT;

const app = express();
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Unscripted Cagematch API is live'));

app.listen(port);
console.log(`Worker listening on :${port}`);
