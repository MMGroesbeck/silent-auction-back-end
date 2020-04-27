const db = require('../data/dbConfig');
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
    find,
    add,
    findById,
    remove
};

function find(token) {
    return db("watching")
        .select("id", "auction_id")
        .where("user_id", token.userId) 
}

function add(token, id) {
    //id, token.id as user_id and id as auction_id
    let watchingData = {
        user_id: token.userId,
        auction_id: id
    }
    return db("watching")
        .insert(watchingData, "id") //
        .then(([id]) => {
            return findById(id);
        })
}

function findById(id) {
    return db("watching")
      .where({ id })
      .first();
}

function remove(user_id, auction_id) {
    console.log({
        auction_id: auction_id,
        user_id: user_id
    })
	return db("watching")
        .where({
            auction_id: auction_id,
            user_id: user_id
        })
        .del();
}