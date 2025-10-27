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

            expect(articles).toBeSortedBy("created_at", { descending: true });
          }
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
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

  describe("PATCH /api/articles/:article_id", () => {
    test("Should respond with status 200 and the updated article when given a valid body and a valid article_id", () => {
      const validBody = { inc_votes: 30 };

      let articleBefore;

      return request(app)
        .get("/api/articles/2")
        .then(({ body }) => {
          articleBefore = body.article;
          return request(app)
            .patch("/api/articles/2")
            .send(validBody)
            .expect(200);
        })
        .then(({ body: patchedBody }) => {
          const updatedArticle = patchedBody.article;
          expect(updatedArticle.votes).toBe(
            articleBefore.votes + validBody.inc_votes
          );

          expect(updatedArticle).toEqual(
            expect.objectContaining({
              article_id: articleBefore.article_id,
              title: articleBefore.title,
              topic: articleBefore.topic,
              author: articleBefore.author,
              created_at: articleBefore.created_at,
              votes: articleBefore.votes + validBody.inc_votes,
            })
          );
        });
    });

    test("Should respond with status 404 when the requested article does not exist", () => {
      return request(app)
        .patch("/api/articles/234")
        .send({ inc_votes: 3 })
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });

    test("Should respond with status 400 when posting with an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/article2")
        .expect(400)
        .send({ inc_votes: 23 })
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(
            "Invalid article_id 'article2' for input of type integer"
          );
        });
    });

    test("Should respond with status 400 when the post does not contain a body", () => {
      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("No body provided for PATCH request");
        });
    });

    describe("POST /api/articles/:article_id/comments - invalid field types", () => {
      test("400 when inc_votes is not a number", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: "3" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                inc_votes: "Expected number, got string",
              })
            );
          });
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

describe("/api/articles/:article_id/comments", () => {
  describe("GET /api/article/:article_id/comments", () => {
    test("should respond with status 200 and the requested comments when given a valid article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                article_id: 1,
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });

          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("should respond with status 200 and an empty array when given a valid article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBe(0);
        });
    });

    test("Should respond with status 404 when the requested article does not exist", () => {
      return request(app)
        .get("/api/articles/234/comments")
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });

    test("Should respond with status 400 when requesting with an invalid id", () => {
      return request(app)
        .get("/api/articles/try2/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(
            "Invalid article_id 'try2' for input of type integer"
          );
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("Should respond with status 201 and the inserted comment when given a valid body and a valid article", () => {
      const validComment = {
        username: "butter_bridge",
        body: "Really nice article!!!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(validComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment).toEqual(
            expect.objectContaining({
              author: validComment.username,
              body: validComment.body,
              article_id: 2,
              comment_id: expect.any(Number),
              votes: 0,
              created_at: expect.any(String),
            })
          );

          expect(Date.parse(comment.created_at)).not.toBe(NaN);
        });
    });

    test("Should respond with status 404 when the requested article does not exist", () => {
      return request(app)
        .post("/api/articles/234/comments")
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });

    test("Should respond with status 400 when posting with an invalid article_id", () => {
      return request(app)
        .post("/api/articles/article2/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(
            "Invalid article_id 'article2' for input of type integer"
          );
        });
    });

    test("Should respond with status 400 when the post does not contain a body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("No body provided for POST request");
        });
    });

    describe("POST /api/articles/:article_id/comments - invalid field types", () => {
      test("400 when username is not a string", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: 123, body: "Valid comment" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                username: "Expected string, got number",
              })
            );
          });
      });

      test("400 when body is not a string", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: "user1", body: [] })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                body: "Expected string, got object",
              })
            );
          });
      });

      test("400 when both fields are invalid", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: 4, body: [] })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                username: "Expected string, got number",
                body: "Expected string, got object",
              })
            );
          });
      });
    });
  });
});

describe("/api/comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("Responds with status 204 and no content when a comment is deleted", () => {
      return request(app).delete("/api/comments/3").expect(204);
    });

    test("Responds with status 404 when the comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/3405")
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Comment does not exist");
        });
    });

    test("Responds with status 400 when given an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/comment1")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe(
            `Invalid comment_id 'comment1' for input of type integer`
          );
        });
    });
  });
});
