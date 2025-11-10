const db = require("../db/connection");

exports.selectAllArticles = (sort_by = "created_at", order = "desc") => {
  return db
    .query(
      `
        SELECT *
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME='articles'
        `
    )
    .then(({ rows }) => {
      const columns = rows.map((row) => {
        return row.column_name;
      });
      return columns;
    })
    .then((columns) => {
      if (!columns.includes(sort_by)) {
        return Promise.reject({
          status: 400,
          msg: "Invalid key sort_by: column does not exist",
        });
      }

      if (!["asc", "desc"].includes(order)) {
        return Promise.reject({
          status: 400,
          msg: "Invalid key order: must be asc or desc",
        });
      }

      const query_str = `
        SELECT articles.* , COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order} 
      `;

      return db.query(query_str);
    })
    .then(({ rows }) => {
      return rows.map(({ body, comment_count, ...article_data }) => {
        return {
          ...article_data,
          comment_count: Number(comment_count),
        };
      });
    });
  // let query_str = `SELECT articles.* , COUNT(comments.comment_id) AS comment_count
  //       FROM articles
  //       LEFT JOIN comments ON articles.article_id = comments.article_id
  //       GROUP BY articles.article_id
  //       ORDER BY $1`;

  // if (order !== "desc" && order === "asc") {
  //   query_str += " ASC";
  // } else query_str += " DESC";

  // return db.query(query_str, [sort_by]).then(({ rows }) => {
  //   return rows.map(({ body, comment_count, ...article_data }) => {
  //     return {
  //       ...article_data,
  //       comment_count: Number(comment_count),
  //     };
  //   });
  // });
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
      return rows[0];
    });
};

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
            WHERE article_id = $1
            ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentOnArticle = (article_id, comment_data) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [article_id, comment_data.username, comment_data.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (article_id, votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return rows[0];
    });
};
