const User = require("../models/user")
const userService = require("../services/userService")

const userController = {
	getLoginPage: (req, res, data) => {
		return res.render("login")
	},
	login: (req, res) => {
		userService.login(req, res, data => {
			if (data.statusCode === 200) return res.redirect("/home")
			return res.render("login", data)
		})
	},
	getRegisterPage: (req, res, data) => {
		return res.render("register")
	},
	register: (req, res) => {
		userService.register(req, res, data => {
			if (data.statusCode === 200) return res.redirect("/users/login")
			return res.render("register", data)
		})
	},
}

module.exports = userController
