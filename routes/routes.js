const express = require("express")
const router = express.Router()
const {
	authenticated,
	authenticatedAdmin,
	authenticatedUser,
} = require("../middlewares/auth")
const passport = require("passport")

const productController = require("../controllers/productController")
const adminController = require("../controllers/adminController")
const userController = require("../controllers/userController")

const multer = require("multer")
const upload = multer({ dest: "temp/" })

// storefront display
router.get("/", (req, res) => {
	return res.render("index")
})
router.get("/home", productController.getHome)
router.get("/products", productController.getProducts)
router.get("/products/:id", productController.getProduct)

// admin control panel
router
	.route("/admin")
	.get(authenticatedAdmin, (req, res) => res.redirect("/admin/products")) // redirect when access '/admin'
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

router.get("/users/login", userController.getLoginPage)
router.post(
	"/users/login",
	passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureFlash: true,
	}),
	userController.login
)

router.get("/users/register", userController.getRegisterPage)
router.post("/users/register", userController.register)

router.get("/users/logout", (req, res) => {
	req.logOut()
	req.flash("success_msg", "你已成功登出！")
	res.redirect("/users/login")
})

module.exports = router
