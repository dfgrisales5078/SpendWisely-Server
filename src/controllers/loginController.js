const pool = require("../config/db");

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  pool.query(query, [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error querying the database");
    }

    // TODO - use a library to compare the password with the hashed password
    if (results.length === 0 || results[0].password_hash !== password) {
      console.log(results);
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // TODO - use a library to generate a JWT token
    res.send({ message: "Logged in successfully" });
  });
};
