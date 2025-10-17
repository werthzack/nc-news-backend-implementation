const db = require("./connection");

db.query(
  `
    SELECT * FROM users`
)
  .then(({ rows }) => {
    //   console.log(rows);
    return db.query(
      `
    SELECT * FROM articles
    WHERE topic = 'coding'
    `
    );
  })
  .then(({ rows }) => {
    // console.log(rows, rows.length);
    return db.query(`
        SELECT * FROM comments
        WHERE votes = 0`);
  })
  .then(({ rows }) => {
    console.log(rows);
  });
