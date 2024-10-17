const express = require("express");
const router = express.Router();
const {
  removeAComment,
  updateVotesByCommentId,
} = require("../controllers/comments-controllers");

router.patch("/:comment_id", updateVotesByCommentId);
router.delete("/:comment_id", removeAComment);

module.exports = router;
