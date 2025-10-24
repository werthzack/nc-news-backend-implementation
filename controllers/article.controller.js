const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
} = require("../models/article.model");

exports.getAllArticles = (req, res) => {
  return selectAllArticles().then((articles) => {
    res.send(articles);
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid article_id '${article_id}' for input of type integer`;
      }
      next(err);
    });
};

exports.getCommentsFromArticle = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticle(article_id)
    .then((comments) => {
      res.send(comments);
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid article_id '${article_id}' for input of type integer`;
      }
      next(err);
    });
};
