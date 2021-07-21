const express = require('express')
const router = express.Router()
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middlewares/auth')

const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const adminController = require('../controllers/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// storefront display
router.get('/', (req, res) => res.redirect('/home'))
router.get('/home', productController.getHome)
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

// cart
router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

// admin control panel
router.get('/admin', (req, res) => res.redirect('/admin/products')) // redirect when access '/admin'
router.get('/admin/products', adminController.getProducts)
router.get('/admin/products/create', adminController.getCreateProduct)
router.get('/admin/products/:id', adminController.getProduct)
router.get('/admin/products/:id/edit', adminController.editProduct)

router.post(
  '/admin/products',
  upload.single('image'),
  adminController.postProduct
)
router.put(
  '/admin/products/:id',
  upload.single('image'),
  adminController.putProduct
)
router.delete('/admin/products/:id', adminController.deleteProduct)

module.exports = router
