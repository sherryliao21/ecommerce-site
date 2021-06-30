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
    
    before(() => {
      Cart.associate({ Product })
    })

    it('defined a hasMany association with Product as CartItem', (done) => {
      expect(Cart.hasMany).to.have.been.calledWith(Product, {
        as: 'CartItem'
      })
      done()
    })
  })
  // check CRUD action
  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Cart.create({ CartId: 1 }).then((cart) => {
        data = cart
        done()
      })
    })

    it('read', (done) => {
      db.Cart.findByPk(data.id).then((cart) => {
        expect(data.id).to.be.equal(cart.id)
        done()
      })
    })

    it('update', () => {
      db.Cart.update({}, { where: { id: data.id }}).then(() => {
        db.Cart.findByPk(data.id).then((cart) => {
          expect(data.updatedAt).to.be.not.equal(cart.updatedAt)
          done()
        })
      })
    })

    it('delete', () => {
      db.Cart.destroy({ where: { id: data.id }}).then(() => {
        db.Cart.findByPk(data.id).then((cart) => {
          expect(cart).to.be.equal(null)
          done()
        })
      })
    })
  })
})
