const chai = require('chai')
const sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const CartItemModel = require('../../models/cartItem')

describe('# CartItem Model', () => {

  before(done => {
    done()

  })

  const CartItem = CartItemModel(sequelize, dataTypes)
  const cartItem = new CartItem()

  checkModelName(CartItem)('CartItem')

  // check property
  context('properties', () => {
    ;['quantity'].forEach(checkPropertyExists(cartItem))
  })

  // data association
  context('associations', () => {
    const Product = 'Product'
    const Cart = 'Cart'
    
    before(() => {
      CartItem.associate({ Product })
      CartItem.associate({ Cart })
    })

    it('defined a belongsTo association with Cart', (done) => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Cart)
      done()
    })

    it('defined a belongsTo association with Product', (done) => {
      expect(CartItem.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })
  // check CRUD action
  context('action', () => {

    let data = null

    it('create', (done) => {
      db.CartItem.create({ CartItemId: 1, quantity: 1 }).then((cartItem) => {
        data = cartItem
        done()
      })
    })

    it('read', (done) => {
      db.CartItem.findByPk(data.id).then((cartItem) => {
        expect(data.id).to.be.equal(cartItem.id)
        done()
      })
    })

    it('update', () => {
      db.CartItem.update({}, { where: { id: data.id }}).then(() => {
        db.CartItem.findByPk(data.id).then((cartItem) => {
          expect(data.updatedAt).to.be.not.equal(cartItem.updatedAt)
          done()
        })
      })
    })

    it('delete', () => {
      db.CartItem.destroy({ where: { id: data.id }}).then(() => {
        db.CartItem.findByPk(data.id).then((cartItem) => {
          expect(cartItem).to.be.equal(null)
          done()
        })
      })
    })
  })
})
