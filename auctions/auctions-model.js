const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
    getLatest
}

function getLatest(id) { //takes integer auction id as parameter
    return db("bids")
        .where({auction_id: id})
        .max("bid_amount");
}