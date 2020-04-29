const db = require("../data/dbConfig");

module.exports = {
    setCompleted,
    setCompletedArr,
    setCompletedAll,
    checkExpired
}

function setCompleted(id){
    return db("auctions")
        .where("id", id)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", Date.now())
        .update({status: "completed"});
}

function setCompletedArr(ids){
    return db("auctions")
        .whereIn("id", ids)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", Date.now())
        .update({status: "completed"});
}

function setCompletedAll(){
    return db("auctions")
        .where("status", "active")
        .andWhere("end_datetime", "<", Date.now())
        .update({status: "completed"});
}

function checkExpired(id){
    return db("auctions")
        .where("id", id)
        .then(resp => {
            if (resp[0].end_datetime < Date.now()) {
                return true;
            } else {
                return false;
            }
        });
}