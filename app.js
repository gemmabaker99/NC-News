const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topics-controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles-controllers");

const app = express();

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

//not found endpoints
app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "endpoint does not exist" });
});

//errors
app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ msg: err.message });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "42703") {
    response.status(400).send({ msg: "bad request" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

module.exports = app;
