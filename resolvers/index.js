const auth = require('./auth');
const users = require('./users');

const resolvers = {
  Query: {
    me: users.me,
  },

  Mutation: {
    signup: auth.signup,
    login: auth.login,
    refresh: auth.refresh,
  },
};

module.exports = resolvers;
