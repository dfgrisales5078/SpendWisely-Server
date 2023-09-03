const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");

router.get("/transactions", transactionsController.getTransactions);
router.post("/transactions", transactionsController.addTransaction);
router.delete("/transactions/:id", transactionsController.deleteTransaction);

module.exports = router;
