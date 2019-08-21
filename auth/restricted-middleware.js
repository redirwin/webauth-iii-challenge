module.exports = function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ message: "Please provide valid creds." });
  }
};
