const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("should respond with status 200 and an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(Array.isArray(topics)).toBe(true);

          if (topics.length > 0) {
            topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug");
              expect(topic).toHaveProperty("description");
              expect(topic).toHaveProperty("img_url");
            });
          }
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET /api/articles", () => {
    test("should respond with status 200 and an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(Array.isArray(articles)).toBe(true);
          if (articles.length > 0) {
            articles.forEach((article) => {
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("comment_count");
              expect(typeof article.comment_count).toBe("number");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).not.toHaveProperty("body");
            });

            for (let i = 0; i < articles.length - 1; i++) {
              const dateCurrent = new Date(articles[i].created_at);
              const dateNext = new Date(articles[i + 1].created_at);
              expect(dateCurrent >= dateNext).toBe(true);
            }
          }
        });
    });
  });
});
