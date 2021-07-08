const db = require('../models')
const Product = db.Product
const Category = db.Category

const adminService = {
  getProducts: async (req, res, callback) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true, include: [Category], order: [['id', 'DESC']] })
      return callback({ products })
    }
    catch (error) {
      console.log(error)
    }
  },

}

module.exports = adminService
