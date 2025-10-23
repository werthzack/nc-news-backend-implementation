const { selectAllUsers } = require("../models/user.model");

exports.getAllUsers = (req, res) => {
  return selectAllUsers().then((users) => {
    res.send(users);
  });
};
