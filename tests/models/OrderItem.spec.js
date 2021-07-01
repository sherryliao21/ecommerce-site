const chai = require('chai')
chai.use(require('sinon-chai'))
const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const OrderItemModel = require('../../models/orderItem')

describe('# OrderItem Model', () => {
  before(done => {
    done()
  })

  const OrderItem = OrderItemModel(sequelize, dataTypes)
  const orderItem = new OrderItem()

  checkModelName(OrderItem)('OrderItem')

  context('properties', () => {
    ;['OrderId', 'ProductId', 'quantity', 'price'].forEach(
      checkPropertyExists(orderItem)
    )
  })

  context('associations', () => {
    const Order = 'Order'
    const Product = 'Product'

    before(() => {
      OrderItem.associate({ Product })
      OrderItem.associate({ Order })
    })

    it('should belong to product', done => {
      expect(OrderItem.belongsTo).to.have.been.calledWith(Product)
      done()
    })

    it('should belong to order', done => {
      expect(OrderItem.belongsTo).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    before(async function () {
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Category.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('create', async function () {
      await db.User.create({
        id: 1,
        name: '123',
        email: '123@gmail.com',
        password: '123',
        role: 'user'
      })
      await db.Category.create({ id: 1 })
      await db.Order.create({ id: 1, UserId: 1 })
      await db.Product.create({ id: 1, CategoryId: 1 })
      const orderItem = await db.OrderItem.create({ OrderId: 1, ProductId: 1 })
      data = orderItem
    })

    it('read', async function () {
      const orderItem = await db.OrderItem.findByPk(data.id)
      expect(data.id).to.be.equal(orderItem.id)
    })

    it('update', async function () {
      await db.OrderItem.update({}, { where: { id: data.id } })
      const orderItem = await db.OrderItem.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(orderItem.updatedAt)
    })

    it('delete', async function () {
      await db.OrderItem.destroy({ where: { id: data.id } })
      const orderItem = await db.OrderItem.findByPk(data.id)
      expect(orderItem).to.be.equal(null)
    })
  })
})
