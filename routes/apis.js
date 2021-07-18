const express = require("express")
const router = express.Router()

const productController = require("../controllers/api/productController")
const adminController = require("../controllers/api/adminController")
const userController = require("../controllers/api/userController")

const {
	// authenticated,
	authenticatedAdmin,
	authenticatedUser,
} = require("../middlewares/auth")
const passport = require("passport")

const multer = require("multer")
const upload = multer({ dest: "temp/" })

// storefront
router.get("/products", productController.getProducts)
router.get("/products/:id", productController.getProduct)

// admin control panel
// router.get("/admin/products", adminController.getProducts)
// router.get("/admin/products/create", adminController.getCreateProduct)
// router.get("/admin/products/:id", adminController.getProduct)
// router.get("/admin/products/:id/edit", adminController.editProduct)
// router.post(
// 	"/admin/products",
// 	upload.single("image"),
// 	adminController.postProduct
// )
// router.put(
// 	"/admin/products/:id",
// 	upload.single("image"),
// 	adminController.putProduct
// )
// router.delete("/admin/products/:id", adminController.deleteProduct)

// router.post("/users/login", userController.login)
// router.post("/users/register", userController.register)

router
	.route("/admin/products")
	.all(authenticatedAdmin)
	.get(adminController.getProducts)
	.post(upload.single("image"), adminController.postProduct)
router
	.route("/admin/products/create")
	.get(authenticatedAdmin, adminController.getCreateProduct)
router
	.route("/admin/products/:id")
	.all(authenticatedAdmin)
	.get(adminController.getProduct)
	.put(upload.single("image"), adminController.putProduct)
	.delete(adminController.deleteProduct)
router
	.route("/admin/products/:id/edit")
	.get(authenticatedAdmin, adminController.editProduct)

// users login/logout & register
router
	.route("/users/login")
	.post(passport.authenticate("local"), userController.login)
router.route("/users/register").post(userController.register)

module.exports = router
