const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
};
