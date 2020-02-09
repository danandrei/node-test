// Dependencies
const { User } = require('../models');

async function me(_, args, { user }) {
  // Make sure user is logged in
  if (!user) {
    throw new Error('You are not authenticated!');
  }

  return await User.findOne({ where: { id: user.id } });
}

module.exports = {
  me,
};
