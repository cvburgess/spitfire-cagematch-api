const cors = require('kcors');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const schema = require('./schemas');

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

const app = new Koa();
const db = require('knex')({
  client: 'pg',
  connection: DATABASE_URL
});
const router = new Router();

app.use(cors());

router.get('/', (ctx) => ctx.body = 'Unscripted Cagematch API is live');
router.post('/graphql', koaBody(), graphqlKoa({
  context: { db },
  schema
}));

if (NODE_ENV === 'development') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
}

app.use(router.routes());
app.listen(PORT);

console.log(`Worker listening on :${PORT}`);
