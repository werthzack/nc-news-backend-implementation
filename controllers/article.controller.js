const { selectAllArticles } = require("../models/article.model");

exports.getAllArticles = (req, res) => {
  return selectAllArticles().then((articles) => {
    res.send(articles);
  });
};
