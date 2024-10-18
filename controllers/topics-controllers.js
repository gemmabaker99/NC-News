const { selectTopics, insertATopic } = require("../models/topics-models");

function getTopics(request, response, next) {
  selectTopics().then((results) => {
    response.status(200).send({ topics: results.rows });
  });
}

function postATopic(request, response, next) {
  const { slug, description } = request.body;
  insertATopic(slug, description)
    .then((result) => {
      response.status(201).send({ topic: result });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, postATopic };
