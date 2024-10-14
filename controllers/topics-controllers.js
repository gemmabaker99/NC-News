const selectTopics = require("../models/topics-models");

function getTopics(request, response, next) {
  selectTopics().then((results) => {
    response.status(200).send({ topics: results.rows });
  });
}

module.exports = getTopics;
