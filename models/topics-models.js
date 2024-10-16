const db = require("../db/connection");
function selectTopics() {
  return db.query("SELECT * FROM topics").then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    }
    return results;
  });
}
module.exports = selectTopics;
