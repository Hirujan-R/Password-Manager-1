const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csrf = require('csrf');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { hashPassword, comparePasswords } = require('./hashUtils.js');
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

const csrfProtection = csrf();
const tokens = new csrf();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: "Unauthorised" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user_id = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.cookies.csrfToken;
  if (!csrfToken) {
    return res.status(403).json({ error: "CSRF token is missing." });
  }
  try {
    if (tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
      next();
    } else {
      res.status(403).json({ error: "Invalid CSRF Token "});
    }
  } catch (error) {
    res.status(403).json({ error: "Invalid CSRF Token "});
  }
}

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
})

app.use(express.json());
app.use(cors());
app.use(cookieParser());



// Basic route
app.get('/api/login', async (req, res) => {
  console.log("GET request received.")
  const {email, password} = req.query;
  if (!email || !password) {
    console.log("Error: Email or password is missing.");
    return res.status(400).json({ error: 'Email and password are required ' });
  }
  try {
    const {rows} = await pool.query('SELECT user_id, password_hash FROM users WHERE email = $1', [email]);
    console.log("Database query result:", rows);
    if (rows.length === 0) {
      console.log("Error: User does not exist.");
      return res.status(400).json({ error: 'Incorrect username or password' });
    }
    console.log("Existance of user with inputted email is confirmed.");
    if (await comparePasswords(password, rows[0].password_hash)) {
      console.log("SUCCESS: User logged in successfully");


      const token = jwt.sign({ user_id: rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const csrfToken = tokens.create(process.env.CSRF_SECRET);

      res.cookie('csrfToken', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        maxAge: 3600000
      })

      console.log("CSRF token set.");

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      })

      console.log("JWT token set.");

      return res.status(200).json({ 
        message: 'User logged in successfully',
      })

    } else {
      console.log("ERROR: Incorrect password");
      return res.status(400).json({ error: 'Incorrect username or password' });
    } 
  } catch (error) {
    console.error('Database error:', error);  
    console.log('Database error:', error); 
    return res.status(500).json({ error: 'Server error' , details: error.message });
  }
});


app.post('/api/registration', async (req,res) => {
  console.log("POST request received.")
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Error: Email and passwords are required");
    return res.status(400).json({ error: 'Email and passwords are required'});
  }

  try {

    const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      console.log("Error: User with this email already exists");
      return res.status(400).json({ error: "User with this email already exists" });
    }

    let password_hash = await hashPassword(password);
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id', [email, password_hash]);

    console.log("SUCCESS: User registered successfully.");
    return res.status(201).json({ message: 'User registered successfully', user_id : result.rows[0].user_id });

  } catch (error) {
    console.error('Database error:', error);  
    console.log('Database error:', error); 
    return res.status(500).json({ error: 'Server error' , details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});