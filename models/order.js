'use strict'

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sn: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      shipping_status: DataTypes.STRING
    },
    {}
  )
  Order.associate = function (models) {
    Order.belongsTo(models.User)
    Order.hasMany(models.Payment)
    Order.hasMany(models.OrderItem)
    Order.belongsToMany(models.Product, {
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: 'OrderId',
      as: 'orderedProducts'
    })
  }
  return Order
}
