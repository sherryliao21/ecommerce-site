const User = require("../models/user")
const validator = require("validator")
const { Op } = require("sequelize")

async function checkUserInfo(req) {
	const errors = []
	const { name, email, password, confirmPassword } = req.body

	// Before creating an account or updating account info ,
	// make sure all the required fields are correctly filled out
	if (!name || !email || !password || !confirmPassword) {
		errors.push({ message: "Please fill out all fields." })
	}
	if (email && !validator.isEmail(email)) {
		errors.push({ message: "Please enter the correct email address." })
	}
	if (password && !validator.isByteLength(password, { min: 4, max: 12 })) {
		errors.push({ message: "Password does not meet the required length" })
	}
	if (password !== confirmPassword) {
		errors.push({ message: "Password and checkPassword do not match." })
	}
	if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
		errors.push({ message: "Name can not be longer than 50 characters." })
	}

	if (errors.length > 0) return { errors }

	// email should be unique
	let users

	// register page
	if (!req.user) {
		users = await User.findAll({
			where: { email },
		})
	}

	console.log("users", users)

	if (users.length) return true
	return false
}

module.exports = {
	checkUserInfo,
}
