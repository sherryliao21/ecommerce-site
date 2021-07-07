const productService = require('../services/productService')

const productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      return res.render('products', data)
    })
  }
}

module.exports = productController
