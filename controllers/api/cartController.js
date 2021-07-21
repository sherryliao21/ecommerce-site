const cartService = require('../../services/cartService')

const cartController = {
  postCart: (req, res) => {
    cartService.postCart(req, res, data => {
      return res.json(data)
    })
  },
  getCart: (req, res) => {
    cartService.getCart(req, res, data => {
      return res.render(data)
    })
  },
  addCartItem: (req, res) => {
    cartService.addCartItem(req, res, data => {
      return res.json(data)
    })
  },
  subCartItem: (req, res) => {
    cartService.subCartItem(req, res, data => {
      return res.json(data)
    })
  },
  deleteCartItem: (req, res) => {
    cartService.deleteCartItem(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = cartController
