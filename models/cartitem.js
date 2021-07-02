'use strict'

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      CartId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: DataTypes.INTEGER,
    },
    {}
  )
  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart)
    CartItem.belongsTo(models.Product)
  }
  return CartItem
}