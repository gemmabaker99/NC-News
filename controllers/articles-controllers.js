const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
} = require("../models/articles-models");

function getArticleById(request, response, next) {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then((results) => {
      response.status(200).send({ article: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(request, response, next) {
  selectArticles()
    .then((results) => {
      response.status(200).send({ articles: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(request, response, next) {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then(() => {
      return selectCommentsByArticleId(articleId);
    })
    .then((results) => {
      response.status(200).send({ comments: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId };
