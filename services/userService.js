const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { checkUserInfo } = require('../utils/users')
const validator = require('validator')

const userService = {
  login: async (req, res, callback) => {
    // Make sure all the fields are filled out
    if (!req.body.email || !req.body.password) {
      return callback({
        status: 'error',
        statusCode: 422,
        message: 'All fields are required.'
      })
    }

    try {
      // Check email and password
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return callback({
          status: 'error',
          statusCode: 401,
          message: 'This account does not exist.'
        })
      }

      if (!bcrypt.compare(password, user.password)) {
        return callback({
          status: 'error',
          statusCode: 401,
          message: 'Incorrect Password'
        })
      }

      // Sign token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return callback({
        status: 'success',
        statusCode: 200,
        message: 'login successfully',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  register: async (req, res, callback) => {
    try {
      const result = await checkUserInfo(req)

      if (!result) {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          role: 'user'
        })

        return callback({
          status: 'success',
          statusCode: 200,
          message: `${req.body.email} register successfully! Please login.`,
          email: req.body.email
        })
      }

      // All the required fields should be filled out correctly
      if (result.errors) {
        console.log(result.errors[0].message)
        return callback({
          status: 'error',
          statusCode: 422,
          errors: result.errors[0],
          userInput: req.body
        })
      }

      return callback({
        status: 'error',
        statusCode: 422,
        message: `This user already exists. Choose a different email.`,
        name: req.body.name
      })
    } catch (error) {
      console.log(error)
    }
  },
  
  getEditProfilePage: async (req, res, callback) => {
    try {
      const id = req.user.id
      const user = await User.findByPk(id)
      if (!user) {
        return callback({
          status: 'error',
          message: 'This user does not exist!'
        })
      }
      return callback({
        status: 'success',
        name: user.name,
        email: user.email
      })
    }
    catch (error) {
      console.log(error)
    }
  },

  putProfile: async (req, res, callback) => {
    try {
      const { name, password, confirmPassword } = req.body
      const id = req.user.id
      const user = await User.findByPk(id)
      const errors = []

      if (!user) {
        return callback({
          status: 'error',
          message: 'This user does not exist'
        })
      }

      if (!name || !password || !confirmPassword) {
        errors.push({ message: 'All fields are required' })
      }
      if (password && !validator.isByteLength(password, { min: 4, max: 12 })) {
        errors.push({ message: 'Password does not meet required length' })
      }
      if (!validator.equals(password, confirmPassword)) {
        errors.push({ message: 'Passwords do not match' })
      }
      if (errors.length) {
        return callback({
          status: 'error',
          errors: errors[0]
        })
      }

      const newPassword = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10),
            null
          )

      await user.update({
        ...user,
        name, password: newPassword
      })

      return callback({
        status: 'success',
        message: 'Successfully updated user info',
        user,
        name: user.name,
        email: user.email
      })
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = userService
