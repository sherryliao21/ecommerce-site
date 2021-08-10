const orderService = require('../services/orderService')

const orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, data => {
      return res.render('user/orders', data)
    })
  },
  postOrder: (req, res) => {
    orderService.postOrder(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('user/confirmation', data)
    })
  },
  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.redirect('back')
    })
  },
  getPayment: (req, res) => {
    orderService.getPayment(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('user/payment', data)
    })
  },
  newebpayCallback: (req, res) => {
    orderService.newebpayCallback(req, res, data => {
      if (data.status !== 'success') {
        req.flash('error_msg', data.message)
      } else {
        req.flash('success_msg', data.message)
      }

      return res.redirect('/orders')
    })
  }
}

module.exports = orderController
