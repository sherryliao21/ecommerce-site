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
const OrderModel = require('../../models/order')

describe('# Order Model', () => {
  before(done => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()

  checkModelName(Order)('Order')

  context('properties', () => {
    ;[
      'UserId',
      'sn',
      'amount',
      'name',
      'phone',
      'address',
      'payment_status',
      'shipping_status'
    ].forEach(checkPropertyExists(order))
  })

  context('associations', () => {
    const Payment = 'Payment'
    const OrderItem = 'OrderItem'
    const User = 'User'

    before(() => {
      Order.associate({ Payment })
      Order.associate({ OrderItem })
      Order.associate({ User })
    })

    it('should belong to user', done => {
      expect(Order.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('should have many payments', done => {
      expect(Order.hasMany).to.have.been.calledWith(Payment)
      done()
    })

    it('should have many order items', done => {
      expect(Order.hasMany).to.have.been.calledWith(OrderItem)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', async done => {
      const order = await db.Order.create({ UserId: 1 })
      data = order
      done()
    })

    it('read', async done => {
      const order = await db.Order.findByPK(data.id)
      expect(data.id).to.be.equal(order.id)
      done()
    })

    it('update', async done => {
      const order = await db.Order.findByPK(data.id)
      expect(data.updatedAt).to.be.not.equal(order.updatedAt)
      done()
    })

    it('delete', async done => {
      await db.Order.destroy({ where: { id: data.id } })
      const order = db.Order.findByPK(data.id)
      expect(order).to.be.equal(null)
      done()
    })
  })
})
