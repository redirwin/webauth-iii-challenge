const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");
const restricted = require("./restricted-middleware.js");

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: `${user.username} logged in.` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to log in." });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: "unable to log out" });
      } else {
        res.status(200).json({ message: "Logged out." });
      }
    });
  } else {
    res.status(200).json({ message: "Not logged in." });
  }
});

router.get("/restest", (req, res) => {
  res
    .status(400)
    .json({ message: "You have sucessfully accessed a restricted route." });
});

router.get("/user", (req, res) => {
  if (req.session.userId) {
    Users.findById(req.session.userId)
      .then(user => {
        res.json(user);
      })
      .catch(err =>
        res.status(500).json({
          message: "There was an error getting the user information."
        })
      );
  } else {
    res.status(400).json({ message: "There is no logged-in user." });
  }
});

module.exports = router;
