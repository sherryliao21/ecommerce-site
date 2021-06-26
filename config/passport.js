const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const db = require('../models')
// const User = db.User
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true    // for flash msg
}, (req, username, password, cb) => {
  // User.findOne({ where: { email: username } })
  //   .then(user => {
  //     if (!user) {
  //       return cb(null, false, req.flash('error_msg', ['帳號或密碼輸入錯誤']))
  //     }
  //     if (!bcrypt.compareSync(password, user.password)) {
  //       return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))
  //     }
  //     return cb(null, user)   // if success, pass on user info
  //   })
  //   .catch(err => console.log(err))
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)  // only pass on user.id to save space since the user object is stored in the browser session. if we have the id, we are able to get the entire user object
})
passport.deserializeUser((id, cb) => {
  // User.findByPk(id, {
  //   include: [
  //     { model: Restaurant, as: 'FavoritedRestaurants' },
  //     { model: Restaurant, as: 'LikedRestaurants' },
  //     { model: User, as: 'Followers' },
  //     { model: User, as: 'Followings' }
  //   ]
  // })
  //   .then(user => {
  //     user = user.toJSON()
  //     return cb(null, user)
  //   })
  //   .catch(err => console.log(err))
})

// for JWT strategy
// const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

// let jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// jwtOptions.secretOrKey = process.env.JWT_SECRET

// let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//   User.findByPk(jwt_payload.id, {
//     include: [
//       { model: db.Restaurant, as: 'FavoritedRestaurants' },
//       { model: db.Restaurant, as: 'LikedRestaurants' },
//       { model: User, as: 'Followers' },
//       { model: User, as: 'Followings' }
//     ]
//   }).then(user => {
//     if (!user) return next(null, false)
//     return next(null, user)
//   })
// })
// passport.use(strategy)

module.exports = passport
