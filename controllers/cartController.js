const cartService = require('../services/cartService')

const cartController = {
  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      return res.redirect('back')
    })
  },
  getCart: (req, res) => {
    cartService.getCart(req, res, data => {
      return res.render('cart', data)
    })
  },
  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, data => {
      return res.redirect('back')
    })
  },
  subCartItem: (req, res) => {
    cartService.subCartItem(req, res, data => {
      return res.redirect('back')
    })
  },
  deleteCartItem: (req, res) => {
    cartService.deleteCartItem(req, res, data => {
      return res.redirect('back')
    })
  },
  getCheckoutPage: (req, res) => {
    cartService.getCheckoutPage(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('checkout', data)
    })
  }
}

module.exports = cartController
