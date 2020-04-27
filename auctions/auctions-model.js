const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
    getLatest,
    findBy
}

function findBy(filter) {
    if(filter){
        return db("auctions")
            .where(filter);
    } else {
        return db("auctions");
    }
}

function getLatest(id) { //takes integer auction id as parameter
    return db("bids")
        .where({auction_id: id})
        .max("bid_amount");
}