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
const CategoryModel = require('../../models/category')

describe('# Category Model', () => {
  before(done => {
    done()
  })

  const Category = CategoryModel(sequelize, dataTypes)
  const category = new Category()

  checkModelName(Category)('Category')

  // check property
  context('properties', () => {
    ;['name'].forEach(checkPropertyExists(category))
  })

  // data association
  context('associations', () => {
    const Product = 'Product'
    
    before(() => {
      Category.associate({ Product })
    })

    it('defined a hasMany association with Product', done => {
      expect(Category.hasMany).to.have.been.calledWith(Product)
      done()
    })
  })
  // check CRUD action
  context('action', () => {
    let data = null

    it('create', async function () {
      const category = await db.Category.create({ CategoryId: 1, name: 'dress'})
      data = category
    })

    it('read', async function () {
      const category = await db.Category.findByPk(data.id)
      expect(data.id).to.be.equal(category.id)
    })

    it('update', async function () {
      await db.Category.update({}, { where: { id: data.id }})
      const category = await db.Category.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(category.updatedAt)
    })

    it('delete', async function () {
      await db.Category.destroy({ where: { id: data.id }})
      const category = await db.Category.findByPk(data.id)
      expect(category).to.be.equal(null)
    })
  })
})
