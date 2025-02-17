const db = require("../data/db-config.js");

module.exports = {
  add,
  find,
  findBy,
  inDept,
  findById
};

async function add(user) {
  const [id] = await db("users").insert(user);

  return findById(id);
}

function find() {
  return db("users")
    .select("id", "username", "department")
    .orderBy("id");
}

function findBy(filter) {
  return db("users").where(filter);
}

function inDept(dept) {
  return db("users")
    .where({ department: dept })
    .select("id", "username", "department");
}

function findById(id) {
  return db("users")
    .where({ id })
    .select("id", "username", "department")
    .first();
}
