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
const CartItemModel = require('../../models/cartitem')

describe('# CartItem Model', () => {
  before(done => {
    done()
  })

  const CartItem = CartItemModel(sequelize, dataTypes)
  const cartItem = new CartItem()

  checkModelName(CartItem)('CartItem')

  // check property
  context('properties', () => {
    ;['CartId', 'ProductId', 'quantity'].forEach(checkPropertyExists(cartItem))
  })

  // data association
  context('associations', () => {
    const Product = 'Product'
    const Cart = 'Cart'
    
    before(() => {
      CartItem.associate({ Product })
      CartItem.associate({ Cart })
    })

    it('defined a belongsTo association with Cart', done => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Cart)
      done()
    })

    it('defined a belongsTo association with Product', done => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })
  // check CRUD action
  context('action', () => {
    let data = null

    before(async function () {
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Cart.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('create', async function() {
      await db.Category.create({ id: 1 })
      await db.Product.create({ id: 1, CategoryId: 1 })
      await db.Cart.create({ id: 1, quantity: 1 })
      const cartItem = await db.CartItem.create({ CartId: 1, ProductId: 1, quantity: 1 })
      console.log('cartItem: ', cartItem)
      data = cartItem
    })

    it('read', async function() {
      const cartItem = await db.CartItem.findByPk(data.id)
      expect(data.id).to.be.equal(cartItem.id)
    })

    it('update', async function() {
      await db.CartItem.update({}, { where: { id: data.id }})
      const cartItem = await db.CartItem.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(cartItem.updatedAt)
    })

    it('delete', async function() {
      await db.CartItem.destroy({ where: { id: data.id }})
      const cartItem = await db.CartItem.findByPk(data.id)
      expect(cartItem).to.be.equal(null)
    })
  })
})
