const db = require("../db/connection");

function selectArticleById(articleId) {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, count(comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return result;
    });
}

function selectArticleByTopic(topic) {
  return db
    .query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return result;
    });
}

function selectArticles(sort_by = "created_at", order = "desc", topic) {
  const validSortBys = ["created_at", "title", "topic", "author", "votes"];
  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const validOrders = ["asc", "desc"];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, count(comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryVals = [];
  if (topic) {
    queryVals.push(topic);
    queryString += ` WHERE topic = $1`;
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  return db.query(queryString, queryVals).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 400, message: "bad request" });
    }
    return results;
  });
}

function selectCommentsByArticleId(articleId) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC `,
      [articleId]
    )
    .then((results) => {
      return results;
    });
}

function updateVotesForArticle(articleId, voteIncrease) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [voteIncrease, articleId]
    )
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return results.rows[0];
    });
}

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateVotesForArticle,
  selectArticleByTopic,
};
