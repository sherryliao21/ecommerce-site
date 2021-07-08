const request = require('supertest')
const app = require('../../app')
const chai = require('chai')
chai.use(require('sinon-chai'))
const should = chai.should()
const { expect } = require('chai')

const db = require('../../models')

describe('# Product Request', () => {
  context('# GET', () => {
    describe('GET /products', () => {
      before(async function () {
        await db.Product.destroy({ where: {}, truncate: { cascade: true } })
        await db.Category.destroy({ where: {}, truncate: { cascade: true } })

        await db.Category.create({ id: 1 })
        await db.Category.create({ id: 2 })

        await db.Product.create({
          id: 1,
          CategoryId: 1,
          name: 'test1',
          price: 500,
          description: 'test1 detail',
          quantity: 1,
          image:
            'https://www.collinsdictionary.com/images/full/dress_31690953_1000.jpg'
        })
        await db.Product.create({
          id: 2,
          CategoryId: 2,
          name: 'test2',
          price: 500,
          description: 'test2 detail',
          quantity: 1,
          image:
            'https://www.collinsdictionary.com/images/full/dress_31690953_1000.jpg'
        })
      })

      // GET /products
      it('can render index', done => {
        request(app)
          .get('/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('test1')
            res.text.should.include('test2')
            return done()
          })
      })

      // GET /api/products
      it(' - successfully', done => {
        request(app)
          .get('/api/products')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.products[0].name.should.equal('test1')
            return done()
          })
      })
    })

    describe('GET /products/:id', () => {
      // GET /products/:id
      it('can see product description', done => {
        request(app)
          .get('/products/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            res.text.should.include('test1 detail')
            return done()
          })
      })

      // GET /api/products/:id
      it(' - successfully', done => {
        request(app)
          .get('/api/products/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            res.body.product.description.should.equal('test1 detail')
            return done()
          })
      })

      after(async function () {
        await db.Product.destroy({ where: {}, truncate: { cascade: true } })
        await db.Category.destroy({ where: {}, truncate: { cascade: true } })
      })
    })
  })
})
