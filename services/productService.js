const db = require('../models')
const Product = db.Product
const Category = db.Category

const productService = {
  getProducts: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ''

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    const [categories, result] = await Promise.all([
      Category.findAll({ raw: true, nest: true }),
      Product.findAndCountAll({ where: whereQuery })
    ])

    const data = result.rows.map(product => ({ ...product.dataValues }))

    callback({ products: data, categories, categoryId })
  },
  getProduct: async (req, res, callback) => {
    const [categories, product] = await Promise.all([
      Category.findAll({ raw: true, nest: true }),
      await Product.findByPk(req.params.id)
    ])

    callback({ product: product.toJSON(), categories })
  }
}

module.exports = productService
