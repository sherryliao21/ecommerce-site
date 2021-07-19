const productService = require("../services/productService")

const productController = {
  getProducts: (req, res) => {
    productService.getProducts(req, res, data => {
      return res.render("products", data)
    })
  },
  getProduct: (req, res) => {
    productService.getProduct(req, res, data => {
      return res.render("product", data)
    })
  },
  getHome: (req, res) => {
    productService.getHome(req, res, data => {
      return res.render("home", data)
    })
  },
}

module.exports = productController
