const express = require("express");
const applyMiddlewares = require("./middlewares");
const transactionRoutes = require("./routes/transactionsRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");

const app = express();
const PORT = 4000;

applyMiddlewares(app);

app.use(transactionRoutes);
app.use(authenticationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
