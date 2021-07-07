const productService = require('../../services/productService')

const productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = productController
