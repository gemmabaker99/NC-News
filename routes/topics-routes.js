const express = require("express");
const router = express.Router();
const { getTopics, postATopic } = require("../controllers/topics-controllers");

router.get("/", getTopics);

router.post("/", postATopic);

module.exports = router;
