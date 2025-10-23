const {
  selectAllArticles,
  selectArticleById,
} = require("../models/article.model");

exports.getAllArticles = (req, res) => {
  return selectAllArticles().then((articles) => {
    res.send(articles);
  });
};

exports.getArticleById = (req, res, next) => {
  const { id } = req.params;
  return selectArticleById(id)
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid article_id '${id}' for input of type integer`;
      }
      next(err);
    });
};
