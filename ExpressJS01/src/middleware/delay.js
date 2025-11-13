const delay = (req, res, next) => {
  if (req.headers.authorization) {
    setTimeout(() => {
      next()
    }, 3000)
  }
}
module.exports = delay;