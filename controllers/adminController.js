const adminService = require('../services/adminService')

const adminController = {
  getProducts: (req, res) => {
    adminService.getProducts(req, res, data => {
      return res.render('admin/products', data)
    })
  },
  
  getProduct: (req, res) => {
    adminService.getProduct(req, res, data => {
      return res.render('admin/product', data)
    })
  },

  getCreateProduct: (req, res) => {
    adminService.getCreateProduct(req, res, data => {
      return res.render('admin/create', data)
    })
  }
}

module.exports = adminController