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
      User.associate({ Order })
    })

    it('should have many orders', done => {
      expect(User.hasMany).to.have.been.calledWith(Order)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', async function () {
      const user = await db.User.create({
        name: '123',
        email: '123@gmail.com',
        password: '123',
        role: 'user'
      })
      data = user
    })

    it('read', async function () {
      const user = await db.User.findByPk(data.id)
      expect(data.id).to.be.equal(user.id)
    })

    it('update', async function () {
      await db.User.update({}, { where: { id: data.id } })
      const user = await db.User.findByPk(data.id)
      expect(data.updatedAt).to.be.not.equal(user.updatedAt)
    })

    it('delete', async function () {
      await db.User.destroy({ where: { id: data.id } })
      const user = await db.User.findByPk(data.id)
      expect(user).to.be.equal(null)
    })
  })
})
