// Dependencies
require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('winston');
const jwt = require('express-jwt');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const schema = require('./schema');

// Load DB

// Configure Express
const app = express();
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Auth middleware
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
  })
);

// graphql endpoint
// app.use(
//   '/api',
//   auth,
//   graphqlExpress(req => ({
//     schema,
//     context: {
//       user: req.user,
//     },
//   }))
// );
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req, res }) => ({
    user: req.user,
  }),
});
server.applyMiddleware({ app, path: '/api' });

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error-handler.
app.use((err, req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ status: 401, message: err.message });
  }

  logger.error('~~~ Unexpected error exception start ~~~');
  logger.error(err);
  logger.error('~~~ Unexpected error exception end ~~~');

  return res.status(500).json({ status: 500, message: err.message });
});

app.listen(process.env.PORT, () =>
  logger.info(`Listening on port ${process.env.PORT}`)
);
