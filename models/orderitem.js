'use strict'

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
