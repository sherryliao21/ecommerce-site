const { User } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { checkUserInfo } = require("../utils/users")

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
	register: async (req, res, callback) => {
		try {
			const { name, email, password, confirmPassword } = req.body
			const errors = []

			if (!name || !email || !password || !confirmPassword) {
				errors.push({ message: "Please fill out all fields." })
			}

			if (!errors.length) {
				await User.create({
					name,
					email,
					password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
					role: "user",
				})

				return callback({
					status: "success",
					statusCode: 200,
					message: `${email} registered successfully! Please login.`,
				})
			}

			// const result = await checkUserInfo(req)
			// console.log(result)
			// if (!result) {
			// 	await User.create({
			// 		name: req.body.name,
			// 		email: req.body.email,
			// 		password: bcrypt.hashSync(
			// 			req.body.password,
			// 			bcrypt.genSaltSync(10),
			// 			null
			// 		),
			// 		role: "user",
			// 	})
			// 	console.log("created")
			// 	return callback({
			// 		status: "success",
			// 		statusCode: 200,
			// 		message: `${req.body.email} register successfully! Please login.`,
			// 	})
			// }

			// // All the required fields should be filled out correctly
			// if (result.errors) {
			// 	return callback({
			// 		status: "error",
			// 		statusCode: 422,
			// 		errors: result.errors,
			// 		userInput: req.body,
			// 	})
			// }

			return callback({
				status: "error",
				statusCode: 422,
				message: `A user already exists. Choose a different account or email.`,
			})
		} catch (error) {
			console.log(error)
		}
	},
}

module.exports = userService
