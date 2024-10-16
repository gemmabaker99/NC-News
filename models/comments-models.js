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

function deleteAComment(commentId) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
    .then(() => {
      return {};
    });
}

function getCommentById(commentId) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
      return result;
    });
}

module.exports = { insertAComment, deleteAComment, getCommentById };
