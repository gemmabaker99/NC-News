const selectAllUsers = require("../models/users-models");

function getAllUsers(request, response, next) {
  selectAllUsers()
    .then((results) => {
      response.status(200).send({ users: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getAllUsers;
