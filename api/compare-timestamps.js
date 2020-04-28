const db = require("../data/dbConfig");

module.exports = {
    setCompleted,
    setCompletedArr,
    setCompletedAll,
    checkExpired
}

function setCompleted(id){
    const rightnow = new Date();
    return db("auctions")
        .where("id", id)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", rightnow.toISOString())
        .update({status: "completed"});
}

function setCompletedArr(ids){
    const rightnow = new Date();
    return db("auctions")
        .whereIn("id", ids)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", rightnow.toISOString())
        .update({status: "completed"});
}

function setCompletedAll(){
    const rightnow = new Date();
    return db("auctions")
        .where("status", "active")
        .andWhere("end_datetime", "<", rightnow.toISOString())
        .update({status: "completed"});
}

function checkExpired(id){
    return db("auctions")
        .where("id", id)
        .then(resp => {
            const rightnow = new Date();
            if (resp[0].end_datetime < rightnow.toISOString()) {
                return true;
            } else {
                return false;
            }
        });
}