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
  },
  getCart: async (req, res, callback) => {
    let cart = await Cart.findByPk(req.session.cartId, {
      include: 'cartedProducts'
    })
    cart = cart ? cart.toJSON() : { cartedProducts: [] }

    let totalPrice =
      cart.cartedProducts.length > 0
        ? cart.cartedProducts
            .map(d => d.price * d.CartItem.quantity)
            .reduce((a, b) => a + b)
        : 0
    callback({ cart, totalPrice })
  },
  addCartItem: async (req, res, callback) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity + 1
    })
    callback()
  }
}

module.exports = cartService
