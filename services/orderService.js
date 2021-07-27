const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Category = db.Category
const Product = db.Product

const orderService = {
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
  }
}

module.exports = orderService
