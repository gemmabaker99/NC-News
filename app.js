const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topics-controllers");

const app = express();

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});
app.get("/api/topics", getTopics);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "endpoint does not exist" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ msg: err.message });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

module.exports = app;
