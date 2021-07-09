const adminService = require('../../services/adminService')

const adminController = {
  getProducts: (req, res) => {
    adminService.getProducts(req, res, data => {
      return res.json(data)
    })
  },
  
  getProduct: (req, res) => {
    adminService.getProduct(req, res, data => {
      return res.json(data)
    })
  },

  getCreateProduct: (req, res) => {
    adminService.getCreateProduct(req, res, data => {
      return res.json(data)
    })
  },

  editProduct: (req, res) => {
    adminService.editProduct(req, res, data => {
      return res.json(data)
    })
  },

  postProduct: (req, res) => {
    adminService.postProduct(req, res, data => {
      return res.json(data)
    })
  },

  putProduct: (req, res) => {
    adminService.putProduct(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController