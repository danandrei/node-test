const { Product } = require('../models');

async function getAll({ offset = 0, limit = 12 } = {}, user) {
  const products = await Product.findAndCountAll({
    limit,
    offset,
  });
  return products;
}

module.exports = {
  getAll,
};
