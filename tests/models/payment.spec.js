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
const PaymentModel = require('../../models/payment')

describe('# Payment Model', () => {
  before(done => {
    done()
  })

  const Payment = PaymentModel(sequelize, dataTypes)
  const payment = new Payment()

  checkModelName(Payment)('Payment')

  context('properties', () => {
    ;['OrderId', 'payment_method', 'paid_at', 'params'].forEach(
      checkPropertyExists(payment)
    )
  })

  context('associations', () => {
    const Order = 'Order'

    before(() => {
      Payment.associate({ Order })
    })

    it('should belong to order', done => {
      expect(Payment.belongsTo).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    before(async function () {
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('create', async function () {
      await db.User.create({
        id: 1,
        name: '123',
        email: '123@gmail.com',
        password: '123',
        role: 'user'
      })
      await db.Order.create({ id: 1, UserId: 1 })
      const payment = await db.Payment.create({ OrderId: 1 })
      data = payment
    })

    it('read', async function () {
      const payment = await db.Payment.findByPk(data.id)
      expect(data.id).to.be.equal(payment.id)
    })

    it('update', async function () {
      await db.Payment.update({}, { where: { id: data.id } })
      const payment = await db.Payment.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(payment.updatedAt)
    })

    it('delete', async function () {
      await db.Payment.destroy({ where: { id: data.id } })
      const payment = await db.Payment.findByPk(data.id)
      expect(payment).to.be.equal(null)
    })
  })
})
