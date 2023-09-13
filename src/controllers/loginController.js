const bcrypt = require("bcrypt");
const pool = require("../config/db");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  pool.query(query, [email], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error querying the database");
    }

    if (results.length === 0) {
      console.log("Invalid email or password");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    try {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        console.log("Invalid email or password");
        return res.status(401).send({ message: "Invalid email or password" });
      }

      console.log(`User ${user.name} logged in successfully`);
      res.send({
        message: "Logged in successfully",
        user_id: user.user_id,
        name: user.name,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error verifying password");
    }
  });
};
