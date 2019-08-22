const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, (req, res) => {
  // get logged in user
  Users.findById(req.userId)
    .then(loggedInUser => {
      // then get only the users who are in the same dept
      Users.findBy(loggedInUser.department).then(users => {
        res.status(500).json({ ...loggedInUser, usersInDept: users });
      });
    })
    .catch(err => res.send(err));
});

router.get("/all", restricted, (req, res) => {
  Users.find()
    .then(allUsers => {
      res.status(500).json(allUsers);
    })
    .catch(err => res.send(err));
});

module.exports = router;
