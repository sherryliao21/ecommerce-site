const express = require('express')
const exphbs = require('express-handlebars')

const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT
const passport = require('./config/passport')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }))

app.use(express.static('public'))
// app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.urlencoded({ extended: true }))   // replace body-parser(deprecated)
app.use(express.json())   // replace body-parser(deprecated)
app.use(methodOverride('_method'))
app.use(passport.initialize())  // passport initialize
app.use(passport.session())  // activate passport session
app.use(flash())
app.use(routes)

app.get('/', (req, res) => {
  res.render('./layouts/main')
})

app.listen(PORT, () => {
  console.log(`app is listening at PORT ${PORT}...`)
})

// don't know why this can't work, using app.use('./routes') instead
// require('./routes')(app)

module.exports = app