const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csrf = require('csrf');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { hashPassword, comparePasswords } = require('./hashUtils.js');
const { generateDataKey, decryptDataKey } = require('./kmsUtils.js');
const { encryptPassword, decryptPassword } = require('./encryptionUtils.js');
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

const csrfProtection = csrf({ secret: process.env.CSRF_SECRET });
const tokens = new csrf();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your client's origin
  credentials: true, // Allow credentials (cookies, HTTP authentication)
}));
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  console.log("Start of JWT token verification");
  const token = req.cookies.token;
  if (!token) {
    console.log("ERROR: JWT token is missing.");
    return res.status(400).json({ error: "Unauthorised" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    console.log("SUCCESS: Successful verification of JWT token");
    next();
  } catch (error) {
    console.log("ERROR: Invalid JWT token.");
    return res.status(400).json({ error: "Invalid JWT token" });
  }
}

const verifyCsrfToken = (req, res, next) => {
  console.log("Start of CSRF token verifiaction");
  const csrfToken = req.cookies.csrfToken;
  if (!csrfToken) {
    console.log("ERROR: CSRF token is missing.");
    return res.status(400).json({ error: "CSRF token is missing." });
  }
  try {
    if (tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
      console.log("SUCCESS: Successful verification of CSRF token");
      next();
    } else {
      console.log("ERROR: Invalid CSRF token.");
      return res.status(400).json({ error: "Invalid CSRF Token "});
    }
  } catch (error) {
    console.log("ERROR: Invalid CSRF token.");
    return res.status(400).json({ error: "Invalid CSRF Token "});
  }
}





const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
})



app.post('/api/registration', async (req, res) => {
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
    return res.status(200).json({ message: 'User registered successfully', user_id : result.rows[0].user_id });

  } catch (error) {
    console.error('Database error:', error);  
    console.log('Database error:', error); 
    return res.status(500).json({ error: 'Server error' , details: error.message });
  }
});

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
        secure: true,
        sameSite: 'None', 
        maxAge: 3600000
      })

      console.log("CSRF token set.");

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
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

app.get('/api/getpasswords', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log(req.user_id);
  try {
    const {rows} = await pool.query('SELECT password_id, service_name, password_encrypted, encrypted_data_key FROM passwords WHERE user_id = $1', [req.user_id]);
    if (rows.length === 0) {
      return res.status(200).json({ message: "No Passwords" });
    }
    const return_rows = await Promise.all(rows.map(async (row) => {
      if (row.encrypted_data_key) { 
        const decryptedDataKey = decryptDataKey(row.encrypted_data_key);
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: decryptPassword(row.password_encrypted, decryptedDataKey)
        }
      }
    }));
    return res.status(200).json({ message: "Passwords retrieved", passwords: return_rows});
  } catch (error) {
    console.error('Database error:', error);
    console.log('Database error:', error);
    return res.status(500).json({ error: 'Server error' , details: error.message });
  }
})

app.put('/api/updatepassword', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log("POST request received");
  const {password_id, service_name, password} = req.body;

  if (!password_id || !service_name || !password) {
    // Missing password_id, service_name, or password
    return res.status(400).json({ error: "Invalid request. Password ID, service name and password need to be provided" });
  } 
  
  try {
    // prevent multiple quick update requests
    const {rows: recentChangeLogs} = await pool.query(`SELECT * FROM change_logs WHERE user_id = $1 AND 
      password_id = $2 AND timestamp >= NOW() - INTERVAL '1 minute'`, [req.user_id, password_id]);
    if (recentChangeLogs.length > 0) {
      return res.status(400).json({ error: "Multiple requests within a short period of time are prohibited"});
    }

    // update passswords table.
    const {rows: encrypted_data_key_rows} = await pool.query(`SELECT encrypted_data_key from passwords WHERE password_id = $1`, [password_id]);
    if (encrypted_data_key_rows.length > 0) {
      let data_key = decryptDataKey(encrypted_data_key_rows[0].encrypted_data_key);
      let updatePasswordQuery = `UPDATE passwords 
        SET service_name = $1, password_encrypted = $2, updated_at = CURRENT_TIMESTAMP WHERE password_id = $3`;
      await pool.query(updatePasswordQuery, [service_name, encryptPassword(password, data_key), password_id]);
    
    // insert log into change_logs table.
    let description = "Password with service name " + service_name + " has been updated.";
    let changeLogQuery = `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`;
    await pool.query(changeLogQuery, [req.user_id, password_id, description]);

    return res.status(200).json({ message: "Password successfully updated." });
    } else {return res.status(400).json({ error: "Error updating password. Password doesn't exist in database"});}

  } catch (error) {
    console.error('Database error: ' + error);
    console.log('Error:' + error);
    return res.status(500).json({ error: 'Server error' , details: error.message });} 
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});