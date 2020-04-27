const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
    getBids,
    addBid
}

function getBids(id) { // takes integer user id as param
    return db
        .select(
            "b.id as bid_id",
            "b.user_id as user_id",
            "b.auction_id as auction_id",
            "b.bid_amount",
            "b.bid_time",
            "u.username",
            "a.name"
        )
        .from("bids as b")
        .join("users as u", "u.id", "b.user_id")
        .join("auctions as a", "a.id", "b.auction_id")
        .where({ user_id: id })
        .orderBy("b.bid_time");
};

async function addBid(newBid) { //takes {user_id, auction_id, bid_amount} as param
    return db("bids").insert(newBid, "id");
};