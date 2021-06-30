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

    it('create', async done => {
      const orderItem = await db.OrderItem.create({ ProductId: 1, OrderId: 1 })
      data = orderItem
      done()
    })

    it('read', async done => {
      const orderItem = await db.OrderItem.findByPK(data.id)
      expect(data.id).to.be.equal(orderItem.id)
      done()
    })

    it('update', async done => {
      const orderItem = await db.OrderItem.findByPK(data.id)
      expect(data.updatedAt).to.be.not.equal(orderItem.updatedAt)
      done()
    })

    it('delete', async done => {
      await db.OrderItem.destroy({ where: { id: data.id } })
      const orderItem = db.OrderItem.findByPK(data.id)
      expect(orderItem).to.be.equal(null)
      done()
    })
  })
})
