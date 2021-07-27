const orderService = require('../services/orderService')

const orderController = {
  postCart: (req, res) => {
    orderService.postOrder(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('confirmation', data)
    })
  }
}

module.exports = orderController
