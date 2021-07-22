const express = require("express")
const router = express.Router()

const productController = require("../controllers/api/productController")
const adminController = require("../controllers/api/adminController")
const userController = require("../controllers/api/userController")

const multer = require("multer")
const upload = multer({ dest: "temp/" })

const { authenticated, authenticatedAdmin } = require("../middlewares/api/auth")

// storefront
router.get("/products", productController.getProducts)
router.get("/products/:id", productController.getProduct)

// admin control panel
router
  .route("/admin/products")
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getProducts)
  .post(upload.single("image"), adminController.postProduct)

router
  .route("/admin/products/create")
  .get(authenticated, authenticatedAdmin, adminController.getCreateProduct)

router
  .route("/admin/products/:id")
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getProduct)
  .put(upload.single("image"), adminController.putProduct)
  .delete(adminController.deleteProduct)

router
  .route("/admin/products/:id/edit")
  .get(authenticated, authenticatedAdmin, adminController.editProduct)

router
  .route("/admin/categories")
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getCategories)
  .post(adminController.postCategory)

router
  .route("/admin/categories/:id")
  .all(authenticated, authenticatedAdmin)
  .get(adminController.getCategories)
  .put(adminController.putCategory)
  .delete(adminController.deleteCategory)

// users login/logout & register
router.route("/users/login").post(userController.login)

router.route("/users/register").post(userController.register)

module.exports = router
