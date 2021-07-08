const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')
const adminController = require('../controllers/adminController')

// front
router.get('/', (req, res) => {
  return res.render('index')
})
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

// admin
router.get('/admin', (req, res) => res.redirect('/admin/products'))   // redirect when access '/admin'
router.get('/admin/products', adminController.getProducts)

module.exports = router
