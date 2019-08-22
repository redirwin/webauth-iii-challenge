const jwt = require("jsonwebtoken");

const secrets = require("../config/secrets.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "The token is not valid." });
      } else {
        req.user = { username: decodedToken.username };
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Token needed." });
  }
};
