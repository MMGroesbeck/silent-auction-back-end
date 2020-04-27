const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
  add,
  findBy,
  findById,
};

function findBy(filter, select) {
  return db("users").select(select).where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");

  return findById(id);
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}