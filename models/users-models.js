const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * FROM users`).then((results) => {
    return results;
  });
}

module.exports = selectAllUsers;
