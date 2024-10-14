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
