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

    it('create', async done => {
      const payment = await db.Payment.create({ OrderId: 1 })
      data = payment
      done()
    })

    it('read', async done => {
      const payment = await db.Payment.findByPK(data.id)
      expect(data.id).to.be.equal(payment.id)
      done()
    })

    it('update', async done => {
      const payment = await db.Payment.findByPK(data.id)
      expect(data.updatedAt).to.be.not.equal(payment.updatedAt)
      done()
    })

    it('delete', async done => {
      await db.Payment.destroy({ where: { id: data.id } })
      const payment = db.Payment.findByPK(data.id)
      expect(payment).to.be.equal(null)
      done()
    })
  })
})
