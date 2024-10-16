const { selectArticleById } = require("../models/articles-models");
const {
  insertAComment,
  deleteAComment,
  getCommentById,
} = require("../models/comments-models");

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

function removeAComment(request, response, next) {
  const commentId = request.params.comment_id;
  getCommentById(commentId)
    .then(() => {
      return deleteAComment(commentId);
    })
    .then(() => {
      response.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { postAComment, removeAComment };
