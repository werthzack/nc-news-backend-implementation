const express = require("express");
const { getAllTopics } = require("./controllers");
const { getAllArticles } = require("./controllers/article.controller");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);

module.exports = app;
