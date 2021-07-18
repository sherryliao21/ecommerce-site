const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const db = require("../models")
const User = db.User
const bcrypt = require("bcryptjs")

// local strategy
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true, // for flash msg
		},
		(req, username, password, cb) => {
			User.findOne({ where: { email: req.body.email } })
				.then(user => {
					if (!user) {
						return cb(null, false, req.flash("error_msg", ["此信箱尚未註冊"]))
					}
					if (!bcrypt.compareSync(password, user.password)) {
						return cb(null, false, req.flash("error_msg", "帳號或密碼輸入錯誤"))
					}
					return cb(null, user) // if success, pass on user info
				})
				.catch(err => console.log(err))
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
			profileFields: ["email", "displayName"],
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
					password: hash,
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
			callbackURL: process.env.GOOGLE_CALLBACK,
		},
		async (accessToken, refreshToken, profile, done) => {
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user)
			})
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
const jwt = require("jsonwebtoken")
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
	User.findByPk(jwt_payload.id, {
		include: [{ model: Order, as: "Orders" }],
	}).then(user => {
		if (!user) return next(null, false)
		return next(null, user)
	})
})
passport.use(strategy)

module.exports = passport
