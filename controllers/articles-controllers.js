const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateVotesForArticle,
  selectArticleByTopic,
  insertArticle,
  totalArticleCount,
  removeArticleByArticleId,
} = require("../models/articles-models");

function getArticleById(request, response, next) {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then((results) => {
      response.status(200).send({ article: results.rows[0] });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(request, response, next) {
  const { limit = 10, p = 1 } = request.query;
  const { sort_by, order, topic } = request.query;
  let articlePromise;
  let countPromise = totalArticleCount(topic);

  if (topic) {
    articlePromise = selectArticleByTopic(topic).then(() => {
      return selectArticles(sort_by, order, topic, limit, p);
    });
  } else {
    articlePromise = selectArticles(sort_by, order, topic, limit, p);
  }

  Promise.all([articlePromise, countPromise])
    .then(([articleResults, countResults]) => {
      response.status(200).send({
        articles: articleResults.rows,
        total_count: Number(countResults.rows[0].total_count),
      });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(request, response, next) {
  const articleId = request.params.article_id;
  let { limit = 10, p = 1 } = request.query;

  selectArticleById(articleId)
    .then(() => {
      return selectCommentsByArticleId(articleId, limit, p);
    })
    .then((results) => {
      response.status(200).send({ comments: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

function increaseVotesForArticle(request, response, next) {
  const articleId = request.params.article_id;
  const voteIncrease = request.body.inc_votes;
  updateVotesForArticle(articleId, voteIncrease)
    .then((results) => {
      response.status(200).send({ article: results });
    })
    .catch((err) => {
      next(err);
    });
}

function postAnArticle(request, response, next) {
  const article = request.body;
  insertArticle(article)
    .then((result) => {
      response.status(201).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticleByArticleId(request, response, next) {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then(() => {
      return removeArticleByArticleId(articleId);
    })
    .then((results) => {
      response.status(204).send(results);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  increaseVotesForArticle,
  postAnArticle,
  deleteArticleByArticleId,
};
