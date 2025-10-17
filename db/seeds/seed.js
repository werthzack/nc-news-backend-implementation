const db = require("../connection");
const format = require("pg-format");
const utils = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
        slug VARCHAR(200) PRIMARY KEY,
        description VARCHAR(1000),
        img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        topic VARCHAR(200) REFERENCES topics(slug),
        author VARCHAR(50) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(50) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    })
    .then(() => {
      const fmtTopicsData = utils.formatTopicsData(topicData);
      const insertQuery = format(
        `
        INSERT INTO topics
        (slug, description, img_url)
        VALUES
        %L;
        `,
        fmtTopicsData
      );

      return db.query(insertQuery);
    })
    .then(() => {
      const fmtUserData = utils.formatUserData(userData);
      const insertQuery = format(
        `
        INSERT INTO users
        (username, name, avatar_url)
        VALUES
        %L;
        `,
        fmtUserData
      );
      return db.query(insertQuery);
    })
    .then(() => {
      const fmtArticleData = utils.formatArticlesData(articleData);
      const insertQuery = format(
        `
      INSERT INTO articles
      (created_at, title, topic, author, body, votes, article_img_url)
      VALUES
      %L;
      `,
        fmtArticleData
      );
      return db.query(insertQuery);
    })
    .then(() => {
      return db.query(`
        SELECT article_id, title FROM articles;
        `);
    })
    .then(({ rows }) => {
      const fmtCommentData = utils.formatCommentsData(commentData, rows);
      const insertQuery = format(
        `
      INSERT INTO comments
      (created_at, article_id, body, votes, author)
      VALUES
      %L;
      `,
        fmtCommentData
      );

      return db.query(insertQuery);
    });
};

module.exports = seed;
