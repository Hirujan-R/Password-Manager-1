const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
})

// Basic route
app.get('/api/login', async (req, res) => {
  console.log("GET request received.")
  const {email} = req.query;
  if (!email) {
    console.log("Error: Email is missing.");
    return res.status(400).json({ error: 'Email is required ' });
  }
  try {
    const {rows} = await pool.query('SELECT user_id, password_hash FROM users WHERE email = $1', [email]);
    console.log("Database query result:", rows);
    if (rows.length === 0) {
      console.log("Error: User does not exist.");
      return res.status(400).json({ error: "User with this email doesn't exist" });
    }
    console.log("SUCCESS: The existance of a user with the inputted email is confirmed.");
    res.status(200).json({ 
      message: 'The existance of a user with the inputted email is confirmed.', 
      password_hash: rows[0].password_hash,
      user_id: rows[0].user_id
    })
  } catch (error) {
    console.error('Database error:', error);  
    console.log('Database error:', error); 
    res.status(500).json({ error: 'Server error' , details: error.message });
  }
});


app.post('/api/registration', async (req,res) => {
  console.log("POST request received.")
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    console.log("Error: Email and passwords are required");
    return res.status(400).json({ error: 'Email and passwords are required'});
  }

  try {
    const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      console.log("Error: User with this email already exists");
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id', [email, password_hash]);

    console.log("SUCCESS: User registered successfully.");
    res.status(201).json({ message: 'User registered successfully', user_id : result.rows[0].user_id });

  } catch (error) {
    console.error('Database error:', error);  
    console.log('Database error:', error); 
    res.status(500).json({ error: 'Server error' , details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});