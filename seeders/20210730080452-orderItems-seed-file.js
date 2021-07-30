'use strict';
const db = require('../models')
const Order = db.Order
const Product = db.Product

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const order = await Order.findAll()
    const product = await Product.findAll()

    await queryInterface.bulkInsert('OrderItems',
      Array.from({ length: 10 }).map((d, i) => ({
        OrderId: order[i % 5].id,
        ProductId: product[i % 50].id,
        quantity: Math.floor(Math.random() * 10 + 1),
        price: product[i % 50].price,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {
      where: {},
      truncate: { cascade: true }
    });
  }
};
