const adminService = require('../services/adminService')

const adminController = {
  getProducts: (req, res) => {
    adminService.getProducts(req, res, data => {
      return res.render('admin/products', data)
    })
  },
  
}

module.exports = adminController