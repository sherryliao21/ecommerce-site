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
  },

  deleteProduct: (req, res) => {
    adminService.deleteProduct(req, res, data => {
      return res.json(data)
    })
  },

  getCategories: (req, res) => {
    adminService.getCategories(req, res, data => {
      return res.json(data)
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, data => {
      return res.json(data)
    })
  },

  putCategory: (req, res) => {
    adminService.putCategory(req, res, data => {
      return res.json(data)
    })
  },

  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, data => {
      return res.json(data)
    })
  },

  getOrders: (req, res) => {
    adminService.getOrders(req, res, data => {
      return res.json(data)
    })
  },

  getEditOrder: (req, res) => {
    adminService.getEditOrder(req, res, data => {
      return res.json(data)
    })
  },

  putOrder: (req, res) => {
    adminService.putOrder(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController
