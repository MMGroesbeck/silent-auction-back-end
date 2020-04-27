const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secrets = require("../api/secrets");

const Users = require("./users-model");
const generateToken = require("../api/token-gen");

router.post("/register", (req, res) => {
  let user = req.body;
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);
  user.password = hash;
  // Need to check if email exist and who belongs to....
  Users.findByEmail(user.email, user.role).then((found) => {
    if (found) {
      res
        .status(400)
        .json({ message: "User already exists with that role and email." });
    } else {
      Users.add(user)
        .then((saved) => {
          const token = generateToken.generateToken(saved);
          const newUser = {
              id: saved.id,
              name: saved.username,
              email: saved.email,
              role: saved.role
          };
          res.status(201).json({ user: newUser, token});
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ errorMessage: error.message });
        });
    }
  });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken.generateToken(user);
        const thisUser = {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role
        };
        res.status(200).json({ user: thisUser, token });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

module.exports = router;
