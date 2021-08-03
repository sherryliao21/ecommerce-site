const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/home',
  failureRedirect: '/user/login'
}))

router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] })
)

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  (req, res) => {
    res.redirect('/home')
  }
)

module.exports = router