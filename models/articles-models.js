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

function selectArticles() {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
    )
    .then((results) => {
      const articles = results.rows;
      const articlePromises = articles.map((article) => {
        return db
          .query(
            `SELECT count(comment_id) AS comment_count FROM comments WHERE article_id = $1`,
            [article.article_id]
          )
          .then((result) => {
            article.comment_count = result.rows[0].comment_count;
            return article;
          });
      });
      return Promise.all(articlePromises);
    });
}

module.exports = { selectArticleById, selectArticles };
