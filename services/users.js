// Dependencies
const { User } = require('../models');

function findOne(filter = {}, projections = {}) {
  return User.findOne(filter, projections).exec();
}

async function findOneWithPassword(email, password) {
  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
}

async function create(userData) {
  const newUser = new User(userData);

  try {
    await newUser.validate();
    return newUser.save();
  } catch (validateError) {
    throw new Error(validateError);
  }
}

module.exports = {
  findOne,
  findOneWithPassword,
  create,
};
