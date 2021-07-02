'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
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
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};