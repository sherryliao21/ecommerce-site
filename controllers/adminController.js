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
  },

  editProduct: (req, res) => {
    adminService.editProduct(req, res, data => {
      return res.render('admin/create', data)
    })
  },

  postProduct: (req, res) => {
    adminService.postProduct(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.redirect('/admin/products')
    })
  },

  putProduct: (req, res) => {
    adminService.putProduct(req, res, data => {
      const id = req.params.id
      return res.redirect(`/admin/products/${id}`)
    })
  },

  deleteProduct: (req, res) => {
    adminService.deleteProduct(req, res, data => {
      return res.redirect('/admin/products')
    })
  },

  getCategories: (req, res) => {
    adminService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, data => {
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    adminService.putCategory(req, res, data => {
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, data => {
      return res.redirect('/admin/categories')
    })
  },

  getOrders: (req, res) => {
    adminService.getOrders(req, res, data => {
      return res.render('admin/orders', data)
    })
  },

  getEditOrder: (req, res) => {
    adminService.getEditOrder(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', 'This order does not exist!')
        res.redirect('/admin/orders')
      }
      return res.render('admin/order', data)
    })
  },

  putOrder: (req, res) => {
    adminService.putOrder(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
      }
      return res.redirect('/admin/orders')
    })
  },

  deleteOrder: (req, res) => {
    adminService.deleteOrder(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
      }
      return res.redirect('/admin/orders')
    })
  }
}

module.exports = adminController
