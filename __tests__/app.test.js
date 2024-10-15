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
          console.log(comment);
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
  test("GET 200, responds with an empty array when an article exists but has not comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
});
