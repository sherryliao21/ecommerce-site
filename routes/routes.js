const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

router.get('/', (req, res) => {
  return res.render('index')
})
router.get('/home', productController.getHome)
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

module.exports = router
