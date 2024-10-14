const db = require("../db/connection");

function selectArticleById(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${articleId}`)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return result;
    });
}

module.exports = selectArticleById;
