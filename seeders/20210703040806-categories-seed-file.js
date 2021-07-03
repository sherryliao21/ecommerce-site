'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = ['Top', 'Coats', 'Shirts', 'Dress', 'Accessories']
    await queryInterface.bulkInsert(
      'Categories', 
      Array.from({ length: 5 }).map((d, i) => ({
        name: categories[i],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
    {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {
      where: {},
      truncate: { cascade: true }
    })
  }
};
