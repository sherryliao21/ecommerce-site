const { User } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userService = {
	login: async (req, res, callback) => {
		// Make sure all the fields are filled out
		if (!req.body.email || !req.body.password) {
			return callback({
				status: "error",
				statusCode: 422,
				message: "All fields are required.",
			})
		}

		try {
			// Check email and password
			const { email, password } = req.body
			const user = await User.findOne({ where: { email } })

			if (!user) {
				return callback({
					status: "error",
					statusCode: 401,
					message: "This account does not exist.",
				})
			}

			if (!bcrypt.compareSync(password, user.password)) {
				return callback({
					status: "error",
					statusCode: 401,
					message: "Incorrect Password",
				})
			}

			// Sign token
			const payload = { id: user.id }
			const token = jwt.sign(payload, process.env.JWT_SECRET)
			return callback({
				status: "success",
				statusCode: 200,
				message: "login successfully",
				token: token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			})
		} catch (error) {
			console.log(error)
		}
	},
}

module.exports = userService
