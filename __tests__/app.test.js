const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

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
});
describe("/api/topics", () => {
  test("GET:200, responds with an array of topic objects with a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
