'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = ['Amber', 'Citrine', 'Jade', 'Sapphire', 'Rubellite']
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
      // truncate: true
      // 設定的話會有跟 product 的外鍵限制，需要使用再解除註解
    })
  }
};
