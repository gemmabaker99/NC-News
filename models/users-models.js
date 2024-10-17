const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * FROM users`).then((results) => {
    return results;
  });
}

function selectUserByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return results.rows[0];
    });
}

module.exports = { selectAllUsers, selectUserByUsername };
