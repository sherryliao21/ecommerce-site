const db = require("../models")
const Product = db.Product
const Category = db.Category
const imgur = require("imgur-node-api")
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
	getProducts: async (req, res, callback) => {
		try {
			const products = await Product.findAll({
				raw: true,
				nest: true,
				include: [Category],
				order: [["id", "DESC"]],
			})
			return callback({ products })
		} catch (error) {
			console.log(error)
		}
	},

	getProduct: async (req, res, callback) => {
		try {
			const product = await Product.findByPk(req.params.id, {
				include: [Category],
			})
			if (!product) {
				return callback({
					status: "error",
					message: "This product does not exist",
				})
			}
			return callback({ product: product.toJSON() })
		} catch (error) {
			console.log(error)
		}
	},

	getCreateProduct: async (req, res, callback) => {
		try {
			const categories = await Category.findAll({ raw: true, nest: true })
			return callback({ categories })
		} catch (error) {
			console.log(error)
		}
	},

	editProduct: async (req, res, callback) => {
		try {
			const product = await Product.findByPk(req.params.id, {
				include: [Category],
			})
			if (!product) {
				return callback({
					status: "error",
					message: "This product does not exist",
				})
			}
			const categories = await Category.findAll({ raw: true, nest: true })
			return callback({ product: product.toJSON(), categories })
		} catch (error) {
			console.log(error)
		}
	},

	postProduct: async (req, res, callback) => {
		try {
			const { name, categoryId, price, quantity, description } = req.body
			if (!name) {
				return callback({ status: "error", message: "name didn't exist" })
			}
			const file = req.file
			if (file) {
				imgur.setClientID(IMGUR_CLIENT_ID)
				let image = ""
				await new Promise(async (resolve, reject) => {
					imgur.upload(file.path, async (err, img) => {
						resolve((image = img.data.link))
					})
				})
				const product = await Product.create({
					name,
					price,
					description,
					quantity,
					image: file ? image : null,
					CategoryId: categoryId,
				})
				return callback({
					product,
					status: "success",
					statusCode: 200,
					message: "product successfully created!",
				})
			} else {
				const product = await Product.create({
					name,
					price,
					quantity,
					description,
					image: null,
					CategoryId: categoryId,
				})
				return callback({
					product,
					status: "success",
					statusCode: 200,
					message: "product successfully created!",
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	putProduct: async (req, res, callback) => {
		try {
			const { name, categoryId, price, quantity, description } = req.body
			const id = req.params.id
			const file = req.file
			if (file) {
				imgur.setClientID(IMGUR_CLIENT_ID)
				let image = ""
				await new Promise(async (resolve, reject) => {
					imgur.upload(file.path, async (err, img) => {
						resolve((image = img.data.link))
					})
				})
				const product = await Product.findByPk(id)
				if (!product) {
					return callback({
						status: "error",
						message: "This product does not exist",
					})
				}
				await product.update({
					name,
					price,
					quantity,
					description,
					image: file ? image : product.image,
					CategoryId: categoryId,
				})
				return callback({
					product,
					status: "success",
					statusCode: 200,
					message: "product successfully updated!",
				})
			} else {
				const product = await Product.findByPk(id)
				if (!product) {
					return callback({
						status: "error",
						message: "This product does not exist",
					})
				}
				await product.update({
					name,
					price,
					quantity,
					description,
					image: product.image,
					CategoryId: categoryId,
				})
				return callback({
					status: "success",
					statusCode: 200,
					message: "product successfully updated!",
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	deleteProduct: async (req, res, callback) => {
		try {
			const id = req.params.id
			const product = await Product.findByPk(id)

			if (!product) {
				return callback({
					status: "error",
					message: "This product does not exist",
				})
			}

			await product.destroy()

			return callback({
				status: "success",
				statusCode: 200,
				message: "product successfully deleted!",
			})
		} catch (error) {
			console.log(error)
		}
	},

	getCategories: async (req, res, callback) => {
		try {
			const categories = await Category.findAll({
				raw: true,
				nest: true,
				order: [["id", "DESC"]],
			})
			if (req.params.id) {
				const category = await Category.findByPk(req.params.id)
				return callback({ categories, category: category.toJSON() })
			}

			return callback({ categories })
		} catch (error) {
			console.log(error)
		}
	},

	postCategory: async (req, res, callback) => {
		try {
			const { name } = req.body
			if (!name) {
				req.flash("error_msg", "Please input category name")
				return res.redirect("back")
			} else {
				const category = await Category.create({ name })
				return callback({ category })
			}
		} catch (error) {
			console.log(error)
		}
	},

	putCategory: async (req, res, callback) => {
		try {
			const { id } = req.params
			const { name } = req.body
			const category = await Category.findByPk(id)

			if (!category) {
				return callback({
					status: "error",
					message: "No such category",
				})
			}

			if (!name) {
				req.flash("error_msg", "Please input category name")
				return res.redirect("back")
			} else {
				const category = await Category.findByPk(id)
				await category.update({ name })
				return callback({
					status: "success",
					statusCode: 200,
					message: "Successfully updated category name",
				})
			}
		} catch (error) {
			console.log(error)
		}
	},

	deleteCategory: async (req, res, callback) => {
		try {
			const { id } = req.params
			const category = await Category.findByPk(id)

			if (!category) {
				return callback({
					status: "error",
					message: "No such category",
				})
			}
			await category.destroy()
			return callback({
				status: "success",
				statusCode: 200,
				message: `successfully deleted category ${category.toJSON().name}`,
			})
		} catch (error) {
			console.log(error)
		}
	},
}

module.exports = adminService
