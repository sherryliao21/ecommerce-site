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

    // show quantity selection according to inventory
    let quantity
    if (product.quantity < 10 && product.quantity > 0) {
      quantity = Array.from({ length: product.quantity }).map((_, i) => i + 1)
    } else if (product.quantity >= 10) {
      quantity = Array.from({ length: 10 }).map((_, i) => i + 1)
    }

    callback({ product: product.toJSON(), categories, quantity })
  }
}

module.exports = productService
