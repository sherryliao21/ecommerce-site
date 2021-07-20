const cartService = require('../services/cartService')

const cartController = {
  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      return res.redirect('back')
    })
  }
}

module.exports = cartController
