const { selectArticleById } = require("../models/articles-models");
const insertAComment = require("../models/comments-models");

function postAComment(request, response, next) {
  const { username, body } = request.body;
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then(() => {
      return insertAComment(articleId, username, body);
    })
    .then((result) => {
      response.status(201).send({ comment: result.rows[0] });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = postAComment;
