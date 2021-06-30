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
const UserModel = require('../../models/user')

describe('# User Model', () => {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  context('properties', () => {
    ;['name', 'password', 'email', 'role'].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const Order = 'Order'

    before(() => {
      Order.associate({ Order })
    })

    it('should have many orders', done => {
      expect(User.hasMany).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', async done => {
      const user = await db.User.create({ UserId: 1 })
      data = user
      done()
    })

    it('read', async done => {
      const user = await db.User.findByPK(data.id)
      expect(data.id).to.be.equal(user.id)
      done()
    })

    it('update', async done => {
      const user = await db.User.findByPK(data.id)
      expect(data.updatedAt).to.be.not.equal(user.updatedAt)
      done()
    })

    it('delete', async done => {
      await db.User.destroy({ where: { id: data.id } })
      const user = db.User.findByPK(data.id)
      expect(user).to.be.equal(null)
      done()
    })
  })
})
