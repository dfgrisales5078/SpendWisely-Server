require("dotenv").config({ path: "../.env" });
const express = require("express");
const applyMiddlewares = require("./middlewares");
const transactionRoutes = require("./routes/transactionsRoutes");
const authenticationRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");

const app = express();

applyMiddlewares(app);

app.use(transactionRoutes);
app.use(authenticationRoutes);
app.use(registerRoutes);

// comment to run unit tests
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// uncomment to run unit tests
exports.app = app;
