const { selectAllTopics } = require("../models/topic.model");

exports.getAllTopics = (req, res) => {
  return selectAllTopics().then((topics) => {
    res.send({ topics });
  });
};
