const express = require("express");
const endpoints = require("./endpoints.json");
const articlesRouter = require("./routes/articles-routes");
const commentsRouter = require("./routes/comments-routes");
const usersRouter = require("./routes/users-routes");
const topicsRouter = require("./routes/topics-routes");

const app = express();
app.use(express.json());
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpoints });
});

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
  if (
    (err.code === "22P02") |
    (err.code === "42703") |
    (err.code === "23503") |
    (err.code === "23502") |
    (err.code === "2201W")
  ) {
    response.status(400).send({ msg: "bad request" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "internal server error" });
});

module.exports = app;
