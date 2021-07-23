const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

const getUser = req => {
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser
}
