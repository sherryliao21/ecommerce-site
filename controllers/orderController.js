const orderService = require('../services/orderService')

const orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, data => {
      return res.render('orders', data)
    })
  },
  postOrder: (req, res) => {
    orderService.postOrder(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('confirmation', data)
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
      return res.render('payment', data)
    })
  },

  newebpayCallback: (req, res) => {
    orderService.newebpayCallback(req, res, data => {
      return res.redirect('/orders')
    })
  }
}

module.exports = orderController
