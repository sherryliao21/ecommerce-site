const db = require("../models")
const Product = db.Product
const Category = db.Category

const { Op } = require("sequelize")

const productService = {
  getProducts: async (req, res, callback) => {
    let whereQuery = {}
    let categoryId = ""
    const page = Number(req.query.page) || 1
    const PAGE_LIMIT = 16
    const offset = (page - 1) * PAGE_LIMIT
    let keyword = req.query.keyword

    if (keyword) {
      keyword = req.query.keyword.trim()
      whereQuery.name = { [Op.like]: "%" + keyword + "%" }
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    const [categories, result] = await Promise.all([
      Category.findAll({ raw: true, nest: true }),
      Product.findAndCountAll({ where: whereQuery, offset, limit: PAGE_LIMIT }),
    ])

    // data for pagination
    const pages = Math.ceil(result.count / PAGE_LIMIT)
    const totalPage = Array.from({ length: pages }).map((_, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1

    const data = result.rows.map(product => ({ ...product.dataValues }))

    callback({
      products: data,
      categories,
      categoryId,
      page,
      totalPage,
      prev,
      next,
      keyword,
    })
  },

  getProduct: async (req, res, callback) => {
    const [categories, product] = await Promise.all([
      Category.findAll({ raw: true, nest: true }),
      await Product.findByPk(req.params.id),
    ])

    // show quantity selection according to inventory
    let quantity
    if (product.quantity < 10 && product.quantity > 0) {
      quantity = Array.from({ length: product.quantity }).map((_, i) => i + 1)
    } else if (product.quantity >= 10) {
      quantity = Array.from({ length: 10 }).map((_, i) => i + 1)
    }

    callback({ product: product.toJSON(), categories, quantity })
  },

  getHome: async (req, res, callback) => {
    const categories = await Category.findAll({ raw: true, nest: true })

    callback({ categories })
  },
}

module.exports = productService
