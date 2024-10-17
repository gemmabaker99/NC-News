const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users-models");

function getAllUsers(request, response, next) {
  selectAllUsers()
    .then((results) => {
      response.status(200).send({ users: results.rows });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByUsername(request, response, next) {
  const username = request.params.username;
  selectUserByUsername(username)
    .then((results) => {
      response.status(200).send({ user: results });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserByUsername };
