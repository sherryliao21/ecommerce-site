const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Category = db.Category

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
      quantity: (cartItem.quantity || 0) + Number(req.body.quantity)
    })

    req.session.cartId = cart.id
    return req.session.save(() => {
      callback()
    })
  },
  getCart: async (req, res, callback) => {
    let [cart, categories] = await Promise.all([
      Cart.findByPk(req.session.cartId, {
        include: 'cartedProducts'
      }),
      Category.findAll({ raw: true, nest: true })
    ])

    cart = cart ? cart.toJSON() : { cartedProducts: [] }

    let totalPrice =
      cart.cartedProducts.length > 0
        ? cart.cartedProducts
            .map(d => d.price * d.CartItem.quantity)
            .reduce((a, b) => a + b)
        : 0
    callback({ cart, totalPrice, categories })
  },
  addCartItem: async (req, res, callback) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity + 1
    })
    callback()
  },
  subCartItem: async (req, res, callback) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
    })
    callback()
  },
  deleteCartItem: async (req, res, callback) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.destroy()
    callback()
  }
}

module.exports = cartService
