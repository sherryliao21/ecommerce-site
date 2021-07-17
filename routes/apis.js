const express = require("express")
const router = express.Router()

const productController = require("../controllers/api/productController")
const adminController = require("../controllers/api/adminController")
const userController = require("../controllers/api/userController")

const multer = require("multer")
const upload = multer({ dest: "temp/" })

// storefront
router.get("/products", productController.getProducts)
router.get("/products/:id", productController.getProduct)

// admin control panel
router.get("/admin/products", adminController.getProducts)
router.get("/admin/products/create", adminController.getCreateProduct)
router.get("/admin/products/:id", adminController.getProduct)
router.get("/admin/products/:id/edit", adminController.editProduct)
router.post(
	"/admin/products",
	upload.single("image"),
	adminController.postProduct
)
router.put(
	"/admin/products/:id",
	upload.single("image"),
	adminController.putProduct
)
router.delete("/admin/products/:id", adminController.deleteProduct)

router.post("/users/login", userController.login)
router.post("/users/register", userController.register)

module.exports = router
