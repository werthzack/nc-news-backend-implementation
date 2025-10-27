const { validateSchema } = require("../middleware/schemaValidator");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentOnArticle,
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
  return selectArticleById(article_id)
    .then(() => {
      return selectCommentsByArticle(article_id).then((comments) => {
        res.send(comments);
      });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid article_id '${article_id}' for input of type integer`;
      }
      next(err);
    });
};

exports.postCommentAtArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;

  const schema = {
    username: "string",
    body: "string",
  };
  return selectArticleById(article_id)
    .then(() => {
      if (body !== undefined) {
        const schema_check = validateSchema(schema, body);
        if (!schema_check.valid) {
          res.status(400).send(schema_check.errors);
        } else {
          return insertCommentOnArticle(article_id, body).then((comment) => {
            res.status(201).send(comment);
          });
        }
      } else {
        res.status(400).send({ msg: "No body provided for POST request" });
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid article_id '${article_id}' for input of type integer`;
      }
      next(err);
    });
};
