const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Category = db.Category
const Product = db.Product
const OrderItem = db.OrderItem
const Order = db.Order
const Payment = db.Payment

const moment = require('moment')
const { sendMail, orderConfirmMail } = require('../utils/mail')
const { getDataForTradeInfo, decryptData } = require('../utils/encrypt')

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

      callback({ categories, orders })
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
    const order = await Order.findByPk(req.params.id)
    // User can't cancel other's order
    if (
      !order ||
      order.UserId !== req.user.id ||
      order.shipping_status === '-1'
    ) {
      return callback({ status: 'error', message: "The order doesn't exist" })
    }

    if (order.shipping_status === '-1') {
      return callback({ status: 'error', message: "The order doesn't exist" })
    }

    await order.update({
      ...req.body,
      shipping_status: '-1',
      payment_status: '-1'
    })
    callback({ orderId: order.id })
  },

  getPayment: async (req, res, callback) => {
    try {
      const order = await Order.findByPk(req.params.id)
      const tradeInfo = getDataForTradeInfo(order.amount, 'Order detail', req.user.email)

      order.update({
        ...order,
        sn: tradeInfo.MerchantOrderNo
      })

      callback({
        order: order.toJSON(),
        tradeInfo
      })
    }
    catch (error) {
      console.log(error)
    }
  },

  newebpayCallback: async (req, res, callback) => {
    try {
      // decrypt callback data and find said order with updated sn
      const decryptedData = JSON.parse(decryptData(req.body.TradeInfo))
      const order = await Order.findOne({ where: { sn: decryptedData.Result.MerchantOrderNo } })
        
      await Payment.create({
        OrderId: order.toJSON().id,
        payment_method: decryptedData.Result.PaymentMethod ? decryptedData.Result.PaymentMethod : decryptedData.Result.PaymentType,
        // paid_at: decryptedData.Result.PayTime,  // format mismatch
        paid_at: new Date(), // temporary solution
        params: decryptedData.Status
      })

      if (decryptedData.Status === 'SUCCESS') {
        await order.update({
          ...order,
          payment_status: 1
        })
        req.flash('success_msg', `Order #${order.id} payment success!`)

        // SEND PAYMENT STATUS EMAIL 
        // const mailContent = 
        // await sendMail(req.user.email, mailContent)
      } else {
        req.flash('error_msg', `Order #${order.id} payment failure! ${decryptedData.Message}`)
      }

      callback({ status: 'success' })
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = orderService
