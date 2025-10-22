const { selectAllTopics } = require("../models");

exports.getAllTopics = (req, res) => {
  return selectAllTopics().then((topics) => {
    res.send(topics);
  });
};
