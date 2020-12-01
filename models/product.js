'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
    },
    {}
  );
  Product.associate = function (models) {
    // associations can be defined here
  };

  return Product;
};
