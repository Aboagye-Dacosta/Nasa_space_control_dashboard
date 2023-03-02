const request = require("supertest");
const app = require("../app");
const { mongoConnect, mongoDisconnect } = require("../services/mongo");

//test async end points
describe("Test launches", () => {
  beforeAll(() => mongoConnect(process.env["TEST_DB_STRING"]));
  afterAll(() => mongoDisconnect());

  describe("Test Get /v1/launches", () => {
    jest.setTimeout(30000);
    test("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("Test Post /v1/launches", () => {
    const responseData = {
      mission: "UTTF ks-12",
      target: "Kepler-62 f",
      rocket: "Explorer 1S1",
      launchDate: "january 1, 2028",
    };

    const responseDataWithoutDate = {
      mission: "UTTF ks-12",
      target: "Kepler-62 f",
      rocket: "Explorer 1S1",
    };

    test("should respond with status 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(responseData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requiredDate = new Date(response.body.launchDate).valueOf();
      const expectedDate = new Date(responseData.launchDate).valueOf();

      expect(requiredDate).toBe(expectedDate);
      expect(response.body).toMatchObject(responseDataWithoutDate);
    });

    test("should test whether request body is empty", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({})
        .expect(400);
    });

    test("should catch all missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(responseDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
    });

    test("should catch invalid date format", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send((responseData.launchDate = "Hello"))
        .expect("Content-Type", /json/)
        .expect(400);
    });
  });
});
