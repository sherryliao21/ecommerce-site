const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

const cartService = {
  postCart: async (req, res, callback) => {
    let [cart] = await Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0
      }
    })

    let [cartItem] = await CartItem.findOrCreate({
      where: {
        CartId: cart.id,
        ProductId: req.body.productId
      },
      default: {
        CartId: cart.id,
        ProductId: req.body.productId
      }
    })

    await cartItem.update({
      quantity: (cartItem.quantity || 0) + 1
    })

    req.session.cartId = cart.id
    return req.session.save(() => {
      callback()
    })
  }
}

module.exports = cartService
