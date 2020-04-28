const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
    getLatest,
    findBy,
    bidsNoNames,
    addAuction,
    updateAuction,
    deleteAuction,
    getWinner
}

function findBy(filter) {
    if(filter){
        return db("auctions")
            .where(filter);
    } else {
        return db("auctions");
    }
}

function bidsNoNames(id) {
    return db("bids")
        .select("id", "bid_amount", "bid_time")
        .where({auction_id: id});
}

function getLatest(id) { //takes integer auction id as parameter
    return db("bids")
        .where({auction_id: id})
        .max("bid_amount");
}

function getWinner(id) {
    return db
        .select("u.username", "u.email", "b.bid_amount", "b.bid_time")
        .from("bids as b")
        .join("users as u", "u.id", "b.user_id")
        .where({ auction_id: id });
}

async function addAuction(auction) {
    const [id] = await db("auctions").insert(auction, "id");
    return findBy({id});
}

async function updateAuction(auction, auctionId) {
    const foo = await db("auctions")
        .where("id", auctionId)
        .update(auction);
    return findBy({id: auctionId});
}

async function deleteAuction(id) {
    // return db("auctions")
    //     .where("id", id)
    //     .del();
    const foo = await db("auctions")
        .where("id", id)
        .update({status: "canceled"});
    return findBy({id: id});
}