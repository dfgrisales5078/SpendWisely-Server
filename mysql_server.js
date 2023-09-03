const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = 4000;
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(bodyParser.json());

app.get("/api/transactions", (req, res) => {
  // temporarily hardcoding the user id
  const userId = 1;

  const query = `
        SELECT t.transaction_id, t.transaction_type, t.transaction_amount, t.transaction_date,
        CASE
            WHEN t.transaction_type = 'expense' THEN e.category_name
            ELSE i.category_name
        END AS category_name
        FROM transactions t
        LEFT JOIN expense_categories e ON t.category_id = e.category_id AND t.transaction_type = 'expense'
        LEFT JOIN income_categories i ON t.category_id = i.category_id AND t.transaction_type = 'income'
        WHERE t.user_id = ?
    `;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error retrieving transactions");
    }
    res.send(results);
  });
});

app.post("/api/transactions", (req, res) => {
  const { transactionType, category, amount } = req.body;
  // temporarily hardcoding the user id
  const userId = 1;

  const tableName =
    transactionType === "expense" ? "expense_categories" : "income_categories";
  const queryFindCategory = `SELECT category_id FROM ${tableName} WHERE category_name = ?`;

  pool.query(queryFindCategory, [category], (error, results) => {
    if (error || results.length === 0) {
      console.error(error);
      return res.status(500).send("Error retrieving category");
    }

    const categoryId = results[0].category_id;
    const queryInsert = `
            INSERT INTO transactions (user_id, transaction_type, category_id, transaction_amount, transaction_date)
            VALUES (?, ?, ?, ?, CURDATE())
        `;

    pool.query(
      queryInsert,
      [userId, transactionType, categoryId, amount],
      (error) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error inserting transaction");
        }
        res.send({ message: "Transaction added successfully" });
      }
    );
  });
});

app.delete("/api/transactions/:id", (req, res) => {
  const transactionId = req.params.id;

  const query = `DELETE FROM transactions WHERE transaction_id = ?`;

  pool.query(query, [transactionId], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error deleting transaction");
    }
    res.send({ message: "Transaction deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
