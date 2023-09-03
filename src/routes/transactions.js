const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions");

router.get("/api/transactions", transactionsController.getTransactions);
router.post("/api/transactions", transactionsController.addTransaction);
router.delete(
  "/api/transactions/:id",
  transactionsController.deleteTransaction
);

module.exports = router;
