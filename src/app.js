const express = require("express");
const applyMiddlewares = require("./middlewares");
const transactionRoutes = require("./routes/transactions");

const app = express();
const PORT = 4000;

applyMiddlewares(app);

app.use(transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
