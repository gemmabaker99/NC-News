const express = require("express");
const router = express.Router();
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  increaseVotesForArticle,
  postAnArticle,
} = require("../controllers/articles-controllers");
const { postAComment } = require("../controllers/comments-controllers");

router.get("/:article_id", getArticleById);

router.get("/", getArticles);

router.get("/:article_id/comments", getCommentsByArticleId);

router.patch("/:article_id", increaseVotesForArticle);

router.post("/:article_id/comments", postAComment);

router.post("/", postAnArticle);

module.exports = router;