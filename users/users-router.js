const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      // res.json({ loggedInUser: req.user.username, users });
      res.json({
        userId: req.userId,
        userName: req.userName,
        users
      });
    })
    .catch(err => res.send(err));
});

module.exports = router;
