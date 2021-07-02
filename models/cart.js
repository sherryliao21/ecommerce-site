'use strict'

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      quantity: DataTypes.INTEGER  
    },
    {}
  )
  Cart.associate = function (models) {
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
  return Cart
};