const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const ServerError = require('../lib/server_error');
const bcrypt = require('bcrypt');

const { User } = require('../models');

// Secrets
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Local strategy.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, 'Invalid email or password');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          return done(null, false, 'Invalid email or password');
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

/**
 * JWT strategy code.
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      // check token integrity

      if (!payload.id) {
        return done(new ServerError('Invalid jwt token', 401));
      }

      try {
        const user = await User.findByPk(payload.id);

        if (!user) {
          return done(new Error('Invalid jwt token'));
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});
