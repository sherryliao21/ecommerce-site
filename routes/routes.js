const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')
const adminController = require('../controllers/adminController')

// storefront display
router.get('/', (req, res) => {
  return res.render('index')
})
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

// admin control panel
router.get('/admin', (req, res) => res.redirect('/admin/products'))   // redirect when access '/admin'
router.get('/admin/products', adminController.getProducts)
router.get('/admin/products/create', adminController.getCreateProduct)
router.get('/admin/products/:id', adminController.getProduct)

module.exports = router
