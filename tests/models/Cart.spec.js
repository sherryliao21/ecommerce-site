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
const CartModel = require('../../models/cart')

describe('# Cart Model', () => {
  before(done => {
    done()
  })

  const Cart = CartModel(sequelize, dataTypes)
  const cart = new Cart()

  checkModelName(Cart)('Cart')

  // check property
  context('properties', () => {
    ;[].forEach(checkPropertyExists(cart))
  })

  // data association
  context('associations', () => {
    const Product = 'Product'
    const CartItem = 'CartItem'
    
    before(() => {
      Cart.associate({ Product })
      Cart.associate({ CartItem })
    })

    it('defined a hasMany association with CartItem', done => {
      expect(Cart.hasMany).to.have.been.calledWith(CartItem)
      done()
    })
  })
  // check CRUD action
  context('action', () => {
    let data = null

    it('create', async function() {
      const cart = await db.Cart.create({ CartId: 1, quantity: 1 })
      data = cart
    })

    it('read', async function() {
      const cart = await db.Cart.findByPk(data.id)
      expect(data.id).to.be.equal(cart.id)
    })

    it('update', async function() {
      await db.Cart.update({}, { where: { id: data.id }})
      const cart = await db.Cart.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(cart.updatedAt)
    })

    it('delete', async function() {
      await db.Cart.destroy({ where: { id: data.id }})
      const cart = await db.Cart.findByPk(data.id)
      expect(cart).to.be.equal(null)
    })
  })
})
