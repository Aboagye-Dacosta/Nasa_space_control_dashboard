const app = require("../app");
const request = require("supertest");
const { mongoConnect, mongoDisconnect } = require("../services/mongo");

describe("Test planets", () => {
  beforeAll(() => mongoConnect(process.env["TEST_DB_STRING"]));
  afterAll(() => mongoDisconnect());

  describe("Test Get /v1/planets", () => {
    jest.setTimeout(30000);
    test("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/planets")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.length).toBe(8);
      expect(response.body[0]).toMatchObject({
        keplerName: expect.any(String),
      });
    });
  });
});
