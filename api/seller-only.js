module.exports = (req, res, next) => {
    if (req.decodedToken.role == "seller") {
        next();
    } else {
        res.status(400).json({ message: "Endpoint only available to sellers." });
    }
}