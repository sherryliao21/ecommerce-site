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

    before(async function () {
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('create', async function () {
      await db.User.create({
        id: 1,
        name: '123',
        email: '123@gmail.com',
        password: '123',
        role: 'user'
      })
      const order = await db.Order.create({ UserId: 1 })
      data = order
    })

    it('read', async function () {
      const order = await db.Order.findByPk(data.id)
      expect(data.id).to.be.equal(order.id)
    })

    it('update', async function () {
      await db.Order.update({}, { where: { id: data.id } })
      const order = await db.Order.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(order.updatedAt)
    })

    it('delete', async function () {
      await db.Order.destroy({ where: { id: data.id } })
      const order = await db.Order.findByPk(data.id)
      expect(order).to.be.equal(null)
    })
  })
})
