// Dependencies
require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('winston');
const passport = require('passport');
const schema = require('./schema');
const routes = require('./routes');

// Configure Express
const app = express();
app.use(cors());
app.options((req, res, next) => {
  res.status(200).end();
});
app.use(morgan('common'));
app.use(require('cookie-parser')());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

// Init passport
app.use(passport.initialize());
app.use(passport.session());
require('./lib/passport_strategies');

// Routes
app.use(routes);

app.listen(process.env.PORT, () =>
  logger.info(`Listening on port ${process.env.PORT}`)
);
