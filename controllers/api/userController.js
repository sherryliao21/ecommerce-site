const userService = require("../../services/userService")

const userController = {
	login: (req, res) => {
		userService.login(req, res, data => {
			return res.json(data)
		})
	},
	register: (req, res, data) => {
		userService.register(req, res, data => {
			return res.json(data)
		})
	},
}

module.exports = userController
