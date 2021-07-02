'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      image: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER
    },
    {}
  )
  Product.associate = function (models) {
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.Cart, {
      through: {
        model: models.CartItem,
        unique: false
      },
      foreignKey: 'ProductId',
      as: 'cartedProducts'
    })
    Product.belongsToMany(models.Order, {
      through: {
      model: models.OrderItem,
      unique: false
    },
    foreignKey: 'ProductId',
    as: 'orderedProducts'
    })
  }
  return Product
};