const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ServerError = require('../lib/server_error');
const { User } = require('../models');

function createAccessTokens(user) {
  return {
    accessToken: jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    ),
  };
}

async function signup({ email, password, repeatPassword }) {
  if (!email || !repeatPassword || !password) {
    throw new ServerError(
      'Email, password and repeatPassword are required',
      400
    );
  }

  if (password !== repeatPassword) {
    throw new ServerError('passwords do not match', 400);
  }

  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 10),
  });

  return createAccessTokens(user);
}

async function signin({ email = '', password = '' }) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ServerError('Invalid email or password', 400);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new ServerError('Incorrect password', 400);
  }

  return createAccessTokens(user);
}

module.exports = {
  signup,
  signin,
};
