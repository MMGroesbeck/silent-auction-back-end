const db = require("../data/dbConfig");

module.exports = {
    setCompleted,
    setCompletedArr,
    setCompletedAll,
    checkExpired
}

function setCompleted(id){
    const rightnow = new Date();
    const comparison = (process.env.DB_ENV == "production") ? rightnow.toISOString() : Date.now();
    return db("auctions")
        .where("id", id)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
}

function setCompletedArr(ids){
    const rightnow = new Date();
    const comparison = (process.env.DB_ENV == "production") ? rightnow.toISOString() : Date.now();
    return db("auctions")
        .whereIn("id", ids)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
}

function setCompletedAll(){
    const rightnow = new Date();
    const comparison = (process.env.DB_ENV == "production") ? rightnow.toISOString() : Date.now();
    return db("auctions")
        .where("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
}

function checkExpired(id){
    const rightnow = new Date();
    const comparison = (process.env.DB_ENV == "production") ? rightnow.toISOString() : Date.now();
    return db("auctions")
        .where("id", id)
        .then(resp => {
            if (resp[0].end_datetime < comparison) {
                return true;
            } else {
                return false;
            }
        });
}