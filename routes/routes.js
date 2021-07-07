const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

router.get('/', (req, res) => {
  return res.render('index')
})
router.get('/products', productController.getProducts)

module.exports = router
