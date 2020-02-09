const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
    refreshToken: jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1w',
      }
    ),
  };
}

async function signup(_, { name, email, password }) {
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  return createAccessTokens(user);
}

async function login(_, { email, password }) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Incorrect password');
  }

  return createAccessTokens(user);
}

async function refresh(_, { refreshToken }) {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findOne({ where: { id: decoded.id } });

  if (!user) {
    throw new Error('Invalid token');
  }

  return createAccessTokens(user);
}

module.exports = {
  signup,
  login,
  refresh,
};
