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
const ProductModel = require('../../models/product')

describe('# Product Model', () => {

  before(done => {
    done()

  })

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()

  checkModelName(Product)('Product')

  // check property
  context('properties', () => {
    ;['name', 'price', 'description', 'quantity', 'image'].forEach(checkPropertyExists(product))
  })

  // data association
  context('associations', () => {
    const CartItem = 'CartItem'
    const OrderItem = 'OrderItem'
    const Category = 'Category'
    
    before(() => {
      Product.associate({ CartItem })
      Product.associate({ OrderItem })
      Product.associate({ Category })
    })

    it('defined a belongsToMany association with Cart through CartItem', (done) => {
      expect(Product.belongsToMany).to.have.been.calledWith(Cart, {
        through: CartItem,
        as: 'CartItem'
      })
      done()
    })

    it('defined a belongsToMany association with Order through OrderItem', (done) => {
      expect(Product.belongsToMany).to.have.been.calledWith(Order, {
        through: OrderItem,
        as: 'OrderItem'
      })
      done()
    })

    it('defined a belongsTo association with category', (done) => {
      expect(Product.belongsTo).to.have.been.calledWith(Category)
      done()
    })
  })
  // check CRUD action
  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Product.create({ ProductId: 1, name: 'flora dress', price: 500 }).then((product) => {
        data = product
        done()
      })
    })

    it('read', (done) => {
      db.Product.findByPk(data.id).then((product) => {
        expect(data.id).to.be.equal(product.id)
        done()
      })
    })

    it('update', () => {
      db.Product.update({}, { where: { id: data.id }}).then(() => {
        db.Product.findByPk(data.id).then((product) => {
          expect(data.updatedAt).to.be.not.equal(product.updatedAt)
          done()
        })
      })
    })

    it('delete', () => {
      db.Product.destroy({ where: { id: data.id }}).then(() => {
        db.Product.findByPk(data.id).then((product) => {
          expect(product).to.be.equal(null)
          done()
        })
      })
    })
  })
})
