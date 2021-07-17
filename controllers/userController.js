const User = require("../models/user")
const userService = require("../services/userService")

const userController = {
	getLoginPage: (req, res, data) => {
		return res.render("login")
	},
	login: (req, res) => {
		userService.login(req, res, data => {
			return res.redirect("/home")
		})
	},
}

module.exports = userController
