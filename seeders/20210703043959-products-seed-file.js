'use strict';
const db = require('../models')
const Category = db.Category
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const category = await Category.findAll()

    await queryInterface.bulkInsert(
      'Products',
      Array.from({ length: 50 }).map((d, i) => ({
        CategoryId: category[i % 5].id,
        name: faker.name.firstName(1),
        price: 800 + 50 * (Math.floor(Math.random() * 10)),
        description: faker.lorem.sentences(2, '.'),
        quantity: Math.floor(Math.random() * 100),
        image: faker.image.unsplash.image(300, 400, 'fashion'),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {
      where: {},
      truncate: { cascade: true }
    });
  }
};
