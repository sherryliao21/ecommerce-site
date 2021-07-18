const express = require("express")
const exphbs = require("express-handlebars")
const db = require("./models")
const methodOverride = require("method-override")
const session = require("express-session")
const flash = require("connect-flash")

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config()
}

const app = express()
const PORT = process.env.PORT || 3000
const passport = require("./config/passport")

app.engine(
	"hbs",
	exphbs({
		defaultLayout: "main",
		extname: ".hbs",
		helpers: require("./config/handlebars-helpers"),
	})
)
app.set("view engine", "hbs")

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
)

app.use(express.static("public"))
// app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.urlencoded({ extended: true })) // replace body-parser(deprecated)
app.use(express.json()) // replace body-parser(deprecated)
app.use(methodOverride("_method"))
app.use(passport.initialize()) // passport initialize
app.use(passport.session()) // activate passport session
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.warning_msg = req.flash("warning_msg")
	next()
})

app.listen(PORT, () => {
	db.sequelize.sync() // sync models with database
	console.log(`app is listening at PORT ${PORT}...`)
})

require("./routes")(app)

module.exports = app
