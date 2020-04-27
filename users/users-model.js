const db = require("../data/dbConfig");
const jwt = require('jsonwebtoken');
const secrets = require('../api/secrets');

module.exports = {
  add,
  findBy,
  findById,
  findByEmail
};

function findBy(filter, select) {
  return db("users").select(select).where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");

  return findById(id);
}

function findByEmail(email, role) {
  return db("users")
    .where({ email: email,
              role: role 
            })
    .first();
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}