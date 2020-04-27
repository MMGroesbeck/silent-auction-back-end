const jwt = require('jsonwebtoken');

const secrets = require("./secrets");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    var grab;

    const secret = secrets.jwtSecret;

    if (token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if(error) {
                res.status(401).json({ message: "error"});
            } else {
                req.decodedToken = decodedToken;
                grab = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({ message: "Please, provide credentials"});
    }
}