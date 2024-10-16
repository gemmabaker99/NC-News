const express = require("express");
const router = express.Router();
const { removeAComment } = require("../controllers/comments-controllers");

router.delete("/:comment_id", removeAComment);

module.exports = router;
