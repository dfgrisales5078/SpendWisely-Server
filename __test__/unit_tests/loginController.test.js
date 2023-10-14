const supertest = require("supertest");
const app = require("../../src/app");
const bcrypt = require("bcrypt");

const db = require("../../src/config/db");

jest.mock("../../src/config/db");

describe("Login Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case - Successful login
  it("Successful user login", async () => {
    const password = "amplify";
    const password_hash = await bcrypt.hash(password, 10);

    db.query.mockImplementation((query, params, callback) => {
      callback(null, [
        {
          email: "amplify@email.com",
          password_hash: password_hash,
          user_id: 2,
          name: "Amplify",
        },
      ]);
    });

    const response = await supertest(app)
      .post("/login")
      .send({
        email: "amplify@email.com",
        password: password,
      })
      .expect(200);

    expect(response.body).toEqual({
      message: "Logged in successfully",
      user_id: 2,
      name: "Amplify",
    });
  });

  // Test case - Failed login, invalid credentials
  it("Failed user login", async () => {
    db.query.mockImplementation((query, params, callback) => {
      callback(null, [
        {
          email: "amplifff@email.com",
          password_hash: "password",
          user_id: 2,
          name: "Amplify",
        },
      ]);
    });

    const response = await supertest(app)
      .post("/login")
      .send({
        email: "amplify@email.com",
        password: "password",
      })
      .expect(401);

    expect(response.body).toEqual({
      message: "Invalid email or password",
    });
  });

  afterAll(() => {
    db.end();
  });
});
