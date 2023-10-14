const supertest = require("supertest");
const app = require("../../src/app");

const db = require("../../src/config/db");

jest.mock("../../src/config/db");

describe("Register Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case - Successful registration
  it("Successful user registration", async () => {
    const email = `amplify@email.com`;
    const password = "amplify";

    db.query
      .mockImplementation((query, params, callback) => {
        callback(null, []);
      })
      .mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

    const response = await supertest(app)
      .post("/register")
      .send({
        name: "New User",
        email: email,
        password: password,
      })
      .expect(200);

    expect(response.body).toEqual({
      message: "User registered successfully",
    });
  });

  // Test case - Failed registration, email already exists
  it("Failed user registration", async () => {
    const email = `amplify@email.com`;
    const password = "amplify";

    db.query.mockImplementation((query, params, callback) => {
      callback(null, [{ email: email }]);
    });

    const response = await supertest(app)
      .post("/register")
      .send({
        name: "Existing User",
        email: email,
        password: password,
      })
      .expect(400);

    expect(response.text).toEqual("An account with this email already exists");
  });

  afterAll(() => {
    db.end();
  });
});
