'use strict'

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER
    },
    {}
  )
  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order)
    OrderItem.belongsTo(models.Product)
  }
  return OrderItem
}
