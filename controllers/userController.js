const User = require('../models/user')
const userService = require('../services/userService')

const userController = {
  getLoginPage: (req, res, data) => {
    return res.render('login')
  },
  login: (req, res) => {
    req.flash('success_msg', '登入成功！')
    if (req.user.role === 'admin') return res.redirect('/admin')
    return res.redirect('/home')
  },
  getRegisterPage: (req, res, data) => {
    return res.render('register')
  },
  register: (req, res) => {
    userService.register(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message || data.errors.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect('/user/login')
    })
  },
  getEditProfilePage: (req, res) => {
    userService.getEditProfilePage(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }
      return res.render('user/profile', data)
    })
  }
}

module.exports = userController
