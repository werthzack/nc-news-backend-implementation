const db = require("./connection");

db.query(
  `
    SELECT * FROM users`
)
  .then(({ rows }) => {
    return db.query(
      `
    SELECT * FROM articles
    WHERE topic = 'coding'
    `
    );
  })
  .then(({ rows }) => {
    return db.query(`
        SELECT * FROM comments
        WHERE votes = 0`);
  })
  .then(({ rows }) => {
    console.log(rows);
  });
