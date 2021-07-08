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

  getProduct: async (req, res, callback) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [ Category ] })
      return callback({ product: product.toJSON() })
    }
    catch (error) {
      console.log(error)
    }
  },

  getCreateProduct: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return callback({ categories })
    }
    catch (error) {
      console.log(error)
    }
  }, 

  editProduct: async (req, res, callback) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [ Category ] })
      const categories = await Category.findAll({ raw: true, nest: true })
      return callback({ product: product.toJSON(), categories })
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminService
