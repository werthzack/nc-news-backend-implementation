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
          expect(topics).toBeInstanceOf(Array);

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

  describe("GET /api/articles/:id", () => {
    test("should respond with status 200 and the requested article when given a valid article", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 3,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });

    test("Should respond with status 404 when the requested article does not exist", () => {
      return request(app)
        .get("/api/articles/234")
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });

    test("Should respond with status 400 when requesting with an invalid id", () => {
      return request(app)
        .get("/api/articles/test")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(
            "Invalid article_id 'test' for input of type integer"
          );
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET /api/users", () => {
    test("should respond with status 200 and an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users).toBeInstanceOf(Array);

          if (users.length > 0) {
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          }
        });
    });
  });
});
