const bcrypt = require("bcrypt");
const db = require("../config/db");

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    const queryCheckEmail = "SELECT email FROM users WHERE email = ?";
    db.query(queryCheckEmail, [email], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error executing query");
      }

      if (results.length > 0) {
        console.log("An account with this email already exists");
        return res
          .status(400)
          .send("An account with this email already exists");
      }

      name = name.toLowerCase();
      email = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);
      const queryInsert = `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `;
      db.query(queryInsert, [name, email, hashedPassword], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error registering user");
        }
        console.log(`User ${name} registered successfully`);
        res.json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerUser,
};
