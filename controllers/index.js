const {
  getAllArticles,
  getArticleById,
  getCommentsFromArticle,
} = require("./article.controller.js");
const { getAllTopics } = require("./topic.controller.js");
const { getAllUsers } = require("./user.controller.js");

module.exports = {
  getAllTopics,
  getAllArticles,
  getAllUsers,
  getArticleById,
  getCommentsFromArticle,
};
