const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Category = db.Category
const Product = db.Product
const OrderItem = db.OrderItem
const Order = db.Order

const orderService = {
  postOrder: async (req, res, callback) => {
    try {
      let [cart, categories] = await Promise.all([
        Cart.findByPk(req.body.cartId, {
          include: 'cartedProducts'
        }),
        Category.findAll({ raw: true, nest: true })
      ])

      cart = cart ? cart.toJSON() : { cartedProducts: [] }

      // cart must exist and has at least one item
      if (!cart.cartedProducts.length) {
        return callback({
          status: 'error',
          message: "You don't have any item in your cart"
        })
      }

      // each cartItem's quantity can not exceed the inventory of the product

      for (let product of cart.cartedProducts) {
        if (product.CartItem.quantity > product.quantity) {
          return callback({
            status: 'error',
            message: `Sorry, ${product.name} only has ${product.quantity} left, please choose the quantity of it again.`
          })
        }
      }

      // confirm order
      const order = await Order.create({
        UserId: 2,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        amount: req.body.amount,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status
      })

      // create orderItem and update inventory
      let results = []
      cart.cartedProducts.forEach(addedProduct => {
        results.push(
          OrderItem.create({
            OrderId: order.id,
            ProductId: addedProduct.id,
            price: addedProduct.price,
            quantity: addedProduct.CartItem.quantity
          }),
          Product.findByPk(addedProduct.id).then(product => {
            product.update({
              quantity: (product.quantity -= addedProduct.CartItem.quantity)
            })
          })
        )
      })

      // clear cart
      results.push(CartItem.destroy({ where: { CartId: req.body.cartId } }))

      await Promise.all(results)

      callback({ categories, order: order.toJSON() })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = orderService
