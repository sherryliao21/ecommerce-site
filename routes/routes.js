const express = require('express')
const router = express.Router()
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middlewares/auth')
const passport = require('passport')

const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

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
router.get('/cart/checkout', authenticatedUser, cartController.getCheckoutPage)

// order
router.post('/orders', authenticatedUser, orderController.postOrder)
router.get('/orders', authenticatedUser, orderController.getOrders)

// admin control panel
router.route('/admin').get(
  authenticated,
  authenticatedAdmin,
  (req, res) => res.redirect('/admin/products') // redirect when access '/admin'
)
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

// users login/logout & register
router
  .route('/users/login')
  .get(userController.getLoginPage)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/users/login',
      failureFlash: true
    }),
    userController.login
  )

router
  .route('/users/register')
  .get(userController.getRegisterPage)
  .post(userController.register)

router.get('/users/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', 'You have logged out successfully！')
  res.redirect('/users/login')
})

module.exports = router
