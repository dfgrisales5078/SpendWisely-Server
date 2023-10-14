const supertest = require("supertest");
const app = require("../../src/app");

const db = require("../../src/config/db");

jest.mock("../../src/config/db");

describe("Transactions Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case - Successfully get transactions
  it("Get transactions successfully", async () => {
    const userId = 1;

    db.query.mockImplementation((query, params, callback) => {
      callback(null, [
        {
          transaction_id: 1,
          transaction_type: "expense",
          transaction_amount: 50,
          transaction_date: "2023-10-10",
          timestamp: "2023-10-10 10:10:10",
          category_name: "Education",
        },
      ]);
    });

    const response = await supertest(app)
      .get(`/transactions?userId=${userId}`)
      .expect(200);

    expect(response.body).toEqual([
      {
        transaction_id: 1,
        transaction_type: "expense",
        transaction_amount: 50,
        transaction_date: "2023-10-10",
        timestamp: "2023-10-10 10:10:10",
        category_name: "Education",
      },
    ]);
  });

  // Test case - Failure tos get transactions
  it("Fail to get transactions - missing user_id", async () => {
    const response = await supertest(app).get("/transactions").expect(400);

    expect(response.text).toBe("User ID is required");
  });

  // Test case - Successfully delete transaction
  it("Delete transaction successfully", async () => {
    const transactionId = 1;

    db.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await supertest(app)
      .delete(`/transactions/${transactionId}`)
      .expect(200);

    expect(response.body).toEqual({
      message: "Transaction deleted successfully",
    });
  });

  // Test case - Failure to delete transaction
  it("Fail to delete transaction", async () => {
    const transactionId = 9999;

    db.query.mockImplementation((query, params, callback) => {
      callback(new Error("Transaction not found"));
    });

    const response = await supertest(app)
      .delete(`/transactions/${transactionId}`)
      .expect(500);

    expect(response.text).toBe("Error deleting transaction");
  });

  afterAll(() => {
    db.end();
  });
});
