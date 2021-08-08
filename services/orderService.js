const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Category = db.Category
const Product = db.Product
const OrderItem = db.OrderItem
const Order = db.Order
const User = db.User
const Payment = db.Payment

const moment = require('moment')

const {
  sendMail,
  orderConfirmMail,
  paymentConfirmMail
} = require('../utils/mail')
const { getTradeInfo, decryptTradeInfo } = require('../utils/payment')

const orderService = {
  getOrders: async (req, res, callback) => {
    try {
      let [orders, categories] = await Promise.all([
        Order.findAll({
          where: { UserId: req.user.id },
          include: 'orderedProducts'
        }),
        Category.findAll({ raw: true, nest: true })
      ])

      orders = orders.map(order => {
        order = order.get({ plain: true })
        return {
          id: order.id,
          date: moment.utc(order.createdAt).format('YYYY-MM-DD'),
          amount: order.amount,
          name: order.name,
          phone: order.phone,
          address: order.address,
          payment_status: order.payment_status,
          shipping_status: order.shipping_status,
          orderedProducts: order.orderedProducts
        }
      })

      callback({
        categories,
        orders
      })
    } catch (err) {
      console.log(err)
    }
  },
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
        UserId: req.user.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        amount: req.body.amount,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status
      })

      // create orderItem and update inventory
      let results = []
      let orderedItems = []
      cart.cartedProducts.forEach(addedProduct => {
        const orderedItem = {
          OrderId: order.id,
          ProductId: addedProduct.id,
          price: addedProduct.price,
          quantity: addedProduct.CartItem.quantity
        }
        orderedItems.push({
          ...orderedItem,
          name: addedProduct.name,
          image: addedProduct.image
        })
        results.push(
          OrderItem.create(orderedItem),
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

      // Send email
      const mailContent = orderConfirmMail(order.toJSON(), 'unpaid')
      await sendMail(req.user.email, mailContent)

      callback({ categories, order: order.toJSON() })
    } catch (err) {
      console.log(err)
    }
  },
  cancelOrder: async (req, res, callback) => {
    try {
      const order = await Order.findByPk(req.params.id)
      // User can't cancel other's order
      if (
        !order ||
        order.UserId !== req.user.id ||
        order.shipping_status === '-1'
      ) {
        return callback({ status: 'error', message: "The order doesn't exist" })
      }

      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      callback({ orderId: order.id })
    } catch (err) {
      console.log(err)
    }
  },
  getPayment: async (req, res, callback) => {
    let order = await Order.findByPk(req.params.id)

    if (!order) {
      return callback({
        status: 'error',
        message: "The order doesn't exist"
      })
    }

    const tradeInfo = getTradeInfo(order.amount, 'Product Name', req.user.email)

    await order.update({
      sn: tradeInfo.MerchantOrderNo
    })

    return callback({ order: order.toJSON(), tradeInfo })
  },
  spgatewayCallback: async (req, res, callback) => {
    try {
      if (req.query.from === 'NotifyURL') {
        return
      }

      const data = JSON.parse(decryptTradeInfo(req.body.TradeInfo))
      const sn = data.Result.MerchantOrderNo

      const order = await Order.findOne({
        where: { sn },
        include: User
      })

      if (!order) {
        return callback({
          status: 'error',
          message: "The order doesn't exist"
        })
      }

      // Avoid creating same payment record multiple times
      await Payment.findOrCreate({
        where: { params: sn },
        defaults: {
          OrderId: order.id,
          payment_method: data.Result.PaymentType,
          paid_at: data.Status === 'SUCCESS' ? Date.now() : null,
          params: sn
        }
      })

      if (data.Status === 'SUCCESS') {
        await order.update({ payment_status: 1 })

        // Send payment completion email
        const mailContent = paymentConfirmMail(
          order.toJSON(),
          data.Result.PaymentType
        )
        await sendMail(order.dataValues.User.email, mailContent)

        callback({
          status: 'success',
          message: `Payment for order ${order.id} completed!`
        })
      } else {
        callback({
          status: 'error',
          message: `Payment for order ${order.id} failed, because ERROR[${data.Status}]: ${data.Message} `
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = orderService
