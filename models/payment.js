'use strict'

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payment_method: DataTypes.STRING,
      paid_at: DataTypes.DATE,
      params: DataTypes.STRING
    },
    {}
  )
  Payment.associate = function (models) {
    Payment.belongsTo(models.Order)
  }
  return Payment
}
