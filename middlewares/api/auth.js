const passport = require('passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No jwt token'
        })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.role === 'admin') {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  },
    authenticatedUser: (req, res, next) => {
      if (req.user) {
        console.log('=========req.user', req.user)
      if (req.user.role === 'user') {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  },
}
