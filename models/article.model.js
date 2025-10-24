const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return {
        articles: rows.map(({ body, comment_count, ...article_data }) => {
          return {
            ...article_data,
            comment_count: Number(comment_count),
          };
        }),
      };
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return { article: rows[0] };
    });
};

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT * FROM comments 
            WHERE article_id = $1
            ORDER BY created_at DESC`,
          [article_id]
        )
        .then(({ rows }) => {
          return { comments: rows };
        });
    });
};
