'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasMany(models.CartItem)
      Cart.belongsToMany(models.Product, {
        through: {
          model: models.CartItem,
          unique: false
        },
        foreignKey: 'CartId',
        as: 'cartedProducts'
      })
    }
  };
  Cart.init({
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};