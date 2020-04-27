const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets')

const Users = require("./users-model");
const generateToken = require("../api/token-gen");

router.post("/register", (req, res) => {
    let user = req.body; 
    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(user.password, rounds);
    user.password = hash;
    // Need to check if email exist and who belongs to....
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
});

router.post("/login", (req, res) => {
    let {username, password } = req.body; 

    Users.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = generateToken.generateToken(user);
                res.status(200).json({ message: "Welcome", token});
            } else {
                res.status(401).json({message: "You shall not pass!"});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
});



module.exports = router;