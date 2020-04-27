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
    var grab;
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
        grab = decodedToken;
    })
    console.log(grab);

    return db("watching")
        .select("id", "auction_id")
        .where("user_id", grab.userId)
    
}

function add(token, id) {
    var grab;
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
        grab = decodedToken;
    })
    //id, grab.id as user_id and id as auction_id
    let watchingData = {
        user_id: grab.userId,
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

function remove(token, id) { //need to fix this one
    var grab;
    jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
        grab = decodedToken;
    })
	return findById(id).then((watch) => {
		return db("watching")
			.where({ id })
			.del()
			.then(() => watch);
	});
}