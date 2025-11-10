const express = require("express");
const {
  getAllTopics,
  getAllArticles,
  getAllUsers,
  getArticleById,
  getCommentsFromArticle,
  postCommentAtArticle,
  patchArticleById,
  removeComment,
} = require("./controllers");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsFromArticle);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postCommentAtArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", removeComment);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
