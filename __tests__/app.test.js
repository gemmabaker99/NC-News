const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});
describe("express server", () => {
  test("404, endpoint does not exist", () => {
    return request(app)
      .get("/api/torpics")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "endpoint does not exist" });
      });
  });
  test("GET:200, /api responds with information on other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
describe("/api/topics", () => {
  test("GET:200, responds with an array of topic objects with a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200, responds with an article for the relevant article ID", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0].article_id).toBe(2);
        expect(body.article.length).toBe(1);
      });
  });
  test("GET:404, responds with msg: not found when given a valid ID that does not exist", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("GET:400, responds with msg bad request when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/fred")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET:200, responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined);
        });
        expect(body.articles[0].title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(body.articles[1].title).toBe("A");
        expect(body.articles[2].title).toBe("Sony Vaio; or, The Laptop");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET:200, responds with all comments for the specified article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 400, responds with bad request when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/bad/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("GET 404, responds with not found if given a valid but not available ID", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("not found");
      });
  });
  test("GET 200, responds with an empty array when an article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("POST:201, posts a new comment to the given article id and responds with comment", () => {
    return request(app)
      .post("/api/articles/13/comments")
      .send({ username: "lurker", body: "I love to read your articles" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.author).toBe("lurker");
        expect(body.comment.body).toBe("I love to read your articles");
        expect(body.comment.article_id).toBe(13);
      });
  });
  test("POST: 404, responds with not found when article ID is valid but does not exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({ username: "lurker", body: "I love to read your articles" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("POST:400, responds with bad request when passed an invalid article ID", () => {
    return request(app)
      .post("/api/articles/bad/comments")
      .send({ username: "lurker", body: "I love to read your articles" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("POST:400, responds with bad request when given a comment in the wrong format", () => {
    return request(app)
      .post("/api/articles/13/comments")
      .send({ username: 4, body: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("PATCH:200, updates the votes and then responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(3);
        expect(body.article.votes).toBe(2);
      });
  });
  test("PATCH: 400, responds with bad request when given a different key ", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ changeTopic: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH: 400, responds with bad request when given an invalid data type", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "fred" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH: 400, responds with bad request when given an invalid article ID", () => {
    return request(app)
      .patch("/api/articles/all")
      .send({ inc_votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH:404, responds with not found when given a valid but non existent article ID", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE: 204, deletes a comment by the given comment ID and responds with no content", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE: 400, responds with bad request when given a comment id that is invalid", () => {
    return request(app)
      .delete("/api/comments/bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("DELETE: 404, responds with not found when given a comment ID that is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
});
describe("/api/users", () => {
  test("GET: 200, responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
