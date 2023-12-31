const db = require("../config/db");

exports.getTransactions = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  const query = `
        SELECT t.transaction_id, t.transaction_type, t.transaction_amount, t.transaction_date, t.timestamp, 
        c.category_name
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.category_id
        WHERE t.user_id = ? AND t.transaction_type = c.category_type
        ORDER BY t.timestamp DESC
    `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error retrieving transactions");
    }
    console.log(`Transactions retrieved successfully for user ${userId}`);
    res.send(results);
  });
};

exports.addTransaction = (req, res) => {
  const { userId, transactionType, category, amount, transactionDate } =
    req.body;

  const queryFindCategory = `SELECT category_id FROM categories WHERE category_name = ? AND category_type = ?`;

  db.query(queryFindCategory, [category, transactionType], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error executing query");
    }
    if (results.length === 0) {
      return res.status(400).send("Category not found");
    }

    const categoryId = results[0].category_id;
    const queryInsert = `
          INSERT INTO transactions (user_id, transaction_type, category_id, transaction_amount, transaction_date, timestamp)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

    db.query(
      queryInsert,
      [userId, transactionType, categoryId, amount, transactionDate],
      (error) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error inserting transaction");
        }
        console.log(
          `Succesfully added: transaction_type: ${transactionType}, amount: $${amount}`
        );
        res.send({ message: "Transaction added successfully" });
      }
    );
  });
};

exports.deleteTransaction = (req, res) => {
  const transactionId = req.params.id;

  const query = `DELETE FROM transactions WHERE transaction_id = ?`;

  db.query(query, [transactionId], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error deleting transaction");
    }
    console.log(`Successfully deleted transaction: ${transactionId}`);
    res.send({ message: "Transaction deleted successfully" });
  });
};
