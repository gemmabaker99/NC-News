const db = require("../db/connection");
const format = require("pg-format");
const convertTimestampToDate = require("../db/seeds/utils");

function insertAComment(articleId, username, body) {
  const formattedComment = [body, username, articleId, 0];
  const insertQuery = format(
    `INSERT INTO comments (body, author, article_id, votes) VALUES %L RETURNING *;`,
    [formattedComment]
  );
  return db.query(insertQuery).then((result) => {
    return result;
  });
}

module.exports = insertAComment;
