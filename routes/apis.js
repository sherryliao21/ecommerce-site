const express = require('express')
const router = express.Router()

const productController = require('../controllers/api/productController')
const cartController = require('../controllers/api/cartController')
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middlewares/api/auth')

// storefront
router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

// cart
router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

// admin control panel
router
  .route('/admin/products')
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getProducts)
  .post(upload.single('image'), adminController.postProduct)

router
  .route('/admin/products/create')
  .get(authenticated, authenticatedAdmin, adminController.getCreateProduct)

router
  .route('/admin/products/:id')
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getProduct)
  .put(upload.single('image'), adminController.putProduct)
  .delete(adminController.deleteProduct)

router
  .route('/admin/products/:id/edit')
  .get(authenticated, authenticatedAdmin, adminController.editProduct)

router
  .route('/admin/categories')
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getCategories)
  .post(adminController.postCategory)

router
  .route('/admin/categories/:id')
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getCategories)
  .put(adminController.putCategory)
  .delete(adminController.deleteCategory)

router
  .route('/admin/orders')
  .get(authenticated, authenticatedAdmin, adminController.getOrders)
router
  .route('/admin/orders/:id/edit')
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getEditOrder)
  .put(adminController.putOrder)

// users login/logout & register
router.route('/user/login').post(userController.login)
router.route('/user/register').post(userController.register)

// user profile
router.route('/user/profile')
  .all(authenticated, authenticatedUser)
  .get(userController.getEditProfilePage)
  .put(userController.putProfile)

module.exports = router
