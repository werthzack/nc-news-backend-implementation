const { validateBody } = require("../middleware/bodyValidator");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentOnArticle,
  updateArticleById,
  deleteComment,
} = require("../models/article.model");

exports.getAllArticles = (req, res) => {
  const { sort_by = "created_at", order = "desc" } = req.query || {};
  return selectAllArticles(sort_by, order).then((articles) => {
    res.send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.send({ article });
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
        res.send({ comments });
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
        const schema_check = validateBody(schema, body);
        if (!schema_check.valid) {
          res.status(400).send(schema_check.errors);
        } else {
          return insertCommentOnArticle(article_id, body).then((comment) => {
            res.status(201).send({ comment });
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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;

  if (!body || body.inc_votes === undefined) {
    return res.status(400).send({ msg: "No body provided for PATCH request" });
  }

  const votes = body.inc_votes;
  if (typeof votes === "number") {
    return updateArticleById(article_id, votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        if (err.code === "22P02") {
          err.msg = `Invalid article_id '${article_id}' for input of type integer`;
        }
        next(err);
      });
  } else {
    res.status(400).send({ inc_votes: `Expected number, got ${typeof votes}` });
  }
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteComment(comment_id)
    .then((deletedComment) => {
      res.status(204).send();
    })
    .catch((err) => {
      if (err.code === "22P02") {
        err.msg = `Invalid comment_id '${comment_id}' for input of type integer`;
      }
      next(err);
    });
};
