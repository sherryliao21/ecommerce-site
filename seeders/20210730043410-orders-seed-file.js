'use strict';
const db = require('../models')
const User = db.User
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ where: { role: 'user' } })
    const payment = ['paid', 'unpaid']
    const shipment = ['shipped', 'unshipped']

    await queryInterface.bulkInsert(
      'Orders',
      Array.from({ length: 5 }).map((d, i) => ({
        UserId: user[i % 2].id,
        sn: i + 1,
        amount: Math.floor(Math.random() * 1000) + 500,
        name: user[i % 2].name,
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        payment_status: payment[ i % 2 ],
        shipping_status: shipment[i % 2],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {
      where: {},
      truncate: { cascade: true }
    });
  }
};
