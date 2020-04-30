const db = require("../data/dbConfig");
const Auctions = require("../auctions/auctions-model.js");

module.exports = {
    setCompleted,
    setCompletedArr,
    setCompletedAll,
    checkExpired
}

async function setCompleted(id){
    const rightnow = new Date();
    const comparison = rightnow.toISOString();
    const foo = await db("auctions")
        .where("id", id)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
    return Auctions.findBy({id: id});
}

function setCompletedArr(ids){
    const rightnow = new Date();
    const comparison = rightnow.toISOString();
    return db("auctions")
        .whereIn("id", ids)
        .andWhere("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
}

function setCompletedAll(){
    const rightnow = new Date();
    const comparison =  rightnow.toISOString();
    return db("auctions")
        .where("status", "active")
        .andWhere("end_datetime", "<", comparison)
        .update({status: "completed"});
}

function checkExpired(id){
    const rightnow = new Date();
    const comparison = rightnow.toISOString();
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