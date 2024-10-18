const db = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
  return db.query("SELECT * FROM topics").then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    }
    return results;
  });
}

function selectTopicByName(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, message: "topic not found" });
      }
      return results.rows;
    });
}

function insertATopic(slug, description) {
  let insValues = [];
  if (typeof slug === "string" && typeof description === "string") {
    insValues.push(description);
    insValues.push(slug);
  } else {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const insertQuery = format(
    `INSERT INTO topics (description,slug) VALUES %L RETURNING *`,
    [insValues]
  );

  return db.query(insertQuery).then((results) => {
    return results.rows[0];
  });
}
module.exports = { selectTopics, insertATopic, selectTopicByName };
