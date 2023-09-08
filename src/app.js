require("dotenv").config({ path: "../.env" });
const express = require("express");
const morgan = require("morgan");
const applyMiddlewares = require("./middlewares");
const transactionRoutes = require("./routes/transactionsRoutes");
const authenticationRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");

const app = express();
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
const PORT = 4000;

applyMiddlewares(app);

app.use(transactionRoutes);
app.use(authenticationRoutes);
app.use(registerRoutes);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
