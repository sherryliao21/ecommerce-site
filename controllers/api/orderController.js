const orderService = require('../../services/orderService')

const orderController = {
  getOrders: (req, res) => {
    orderService.getOrders(req, res, data => {
      return res.json(data)
    })
  },
  postOrder: (req, res) => {
    orderService.postOrder(req, res, data => {
      if (data.status === 'error') {
        return res.json(data)
      }
      return res.json(data)
    })
  },
  cancelOrder: (req, res) => {
    orderService.cancelOrder(req, res, data => {
      if (data.status === 'error') {
        return res.json(data)
      }
      return res.json(data)
    })
  },
  getPayment: (req, res) => {
    orderService.getPayment(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = orderController
