const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `
        SELECT articles.*, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
    `
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
