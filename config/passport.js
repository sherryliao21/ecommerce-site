const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const db = require('../models')
const User = db.User
const Order = db.Order
const bcrypt = require('bcryptjs')

// local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // for flash msg
    },
    async (req, username, password, cb) => {
      try {
        const { email } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_msg', ['This email is not registered yet!'])
          )
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(
            null,
            false,
            req.flash('error_msg', 'Wrong input of email or password!')
          )
        }
        return cb(null, user) // if success, pass on user info
      } catch (error) {
        console.log(error)
      }
    }
  )
)

// facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json
        const user = await User.findAll({ where: { email } })
        if (user) return done(null, user)
        const randomPassword = Math.random.toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        await User.create({
          name,
          email,
          password: hash
        })
        return done(null, user)
      } catch (error) {
        console.log(error)
        return done(error, false)
      }
    }
  )
)

// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ where: { googleId: profile.id } })
        console.log("=======profile:", profile)
  
        if (!user) {
          const randomPassword = Math.random.toString(36).slice(-8)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: hash,
            role: 'user',
            googleId: profile.id,
          })
          return done(null, user)
        }
        return done(null, user)
      }
      catch (error) {
        console.log(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    return done(null, user)
  } catch (error) {
    return done(error, null)
  }
})

// for JWT strategy
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    const user = await User.findByPk(jwt_payload.id, {
      include: [Order]
    })

    if (!user) {
      console.log('============ cant find user ===========')
      return next(null, false)
    }
    return next(null, user)
  })
)

module.exports = passport
