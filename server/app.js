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
    return res.status(400).json({ error: "Unauthorised" });
  }
}

const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.cookies.csrfToken;
  if (!csrfToken) {
    console.log("ERROR: CSRF token is missing.");
    return res.status(400).json({ error: "Unauthorised" });
  }
  try {
    if (tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
      console.log("SUCCESS: Successful verification of CSRF token");
      next();
    } else {
      console.log("ERROR: Invalid CSRF token.");
      return res.status(400).json({ error: "Unauthorised" });
    }
  } catch (error) {
    console.log("ERROR: Invalid CSRF token.");
    return res.status(400).json({ error: "Unauthorised" });
  }
}


const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
  max: 20
})



app.post('/api/registration', async (req, res) => {
  console.log('Registration request received');
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Error: Email and passwords are required');
    return res.status(400).json({ error: 'Email and passwords are required'});
  }

  const client = await pool.connect();
  try {
    const {rows} = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (rows.length > 0) {
      console.log('Error: User with this email already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    let password_hash = await hashPassword(password);
    const result = await client.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id`, [email, password_hash]);
    console.log('SUCCESS: User registered successfully.');
    return res.status(200).json({ message: 'User registered successfully', user_id : result.rows[0].user_id });

  } catch (error) {
    console.error('Database error:', error);   
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  }
});

app.get('/api/login', async (req, res) => {
  console.log("Login request received")
  const {email, password} = req.query;
  if (!email || !password) {
    console.error("Error: Email or password is missing.");
    return res.status(400).json({ error: 'Email and password are required ' });
  }
  const client = await pool.connect();
  try {
    const {rows} = await client.query(`SELECT user_id, password_hash FROM users WHERE email = $1`, [email]);
    console.log("Database query result:", rows);
    if (rows.length === 0) {
      console.error("Error: User does not exist.");
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

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3600000
      })

      console.log('SUCCESS: User logged in successfully');
      return res.status(200).json({ 
        message: 'User logged in successfully',
      })

    } else {
      console.log("ERROR: Incorrect password");
      return res.status(400).json({ error: 'Incorrect username or password' });
    } 
  } catch (error) {
    console.error('Database error:', error);  
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/removecookies', async (req, res) => {
  console.log('Remove Cookies request received');
  try {
    res.cookie('csrftoken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0)
    });

    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0)
    });

    console.log('SUCCESS: Cookies successfully removed');
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/getpasswords', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Get Passwords request received');
  const client = await pool.connect();
  try {
    const {rows} = await client.query(`SELECT password_id, service_name, password_encrypted, encrypted_data_key FROM passwords 
      WHERE user_id = $1 ORDER BY created_at`, [req.user_id]);
    if (rows.length === 0) {
      return res.status(200).json({ message: 'No Passwords' });
    }
    const password_rows = await Promise.all(rows.map(async (row) => {
      if (row.encrypted_data_key) { 
        const decryptedDataKey = await decryptDataKey(row.encrypted_data_key);
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: decryptPassword(row.password_encrypted, decryptedDataKey)
        }
      } else {
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: 'Error retrieving password. Please delete the password'
        }
      }
    }));
    console.log('SUCCESS: Passwords retrieved');
    return res.status(200).json({ message: 'Passwords retrieved', passwords: password_rows });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
      client.release();
  }
})

app.post('/api/createpassword', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Create Password request received');
  const {service_name, password} = req.body;
  if (!service_name || !password) {
    // Missing service_name, or password
    return res.status(400).json({ error: 'Invalid request. Service name and password need to be provided' });
  } 

  const client = await pool.connect();
  try {
    //Inserting password in database
    const {dataKey: data_key, encryptedDataKey: encrypted_data_key} = await generateDataKey();
    await client.query(`BEGIN`);
    const {rows: password_id_row} = await client.query(`INSERT INTO passwords (user_id, service_name, password_encrypted, encrypted_data_key) 
      VALUES ($1, $2, $3, $4) RETURNING password_id`, 
      [req.user_id, service_name, encryptPassword({password, dataKey: data_key}), encrypted_data_key]);

    // Insert log into change table
    let description = 'Password with service name ' + service_name + ' has been created.';
    let changeLogQuery = `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`;
    await client.query(changeLogQuery, [parseInt(req.user_id,10), parseInt(password_id_row[0].password_id), description]);
    await client.query(`COMMIT`);

    console.log('SUCCESS: Password successfully created');
    return res.status(200).json({ message: 'Password successfully created.' });
  } catch (error) {
    console.error('Database error: ' + error);
    await client.query(`ROLLBACK`);
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  }
})

app.put('/api/updatepassword', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Update Password request received');
  const {password_id, service_name, password} = req.body;

  if (!password_id || !service_name || !password) {
    // Missing password_id, service_name, or password
    return res.status(400).json({ error: 'Invalid request. Password ID, service name and password need to be provided' });
  } 
  
  const client = await pool.connect();
  try {

    // update passswords table.
    await client.query(`BEGIN`);
    const {rows: password_rows} = await client.query(`SELECT service_name from passwords WHERE password_id = $1`, [password_id]);
    if (password_rows.length > 0) {
      let description = 'Password with service name ' + password_rows[0].service_name + ' has been updated.';
      const {rows: recentChangeLogs} = await client.query(`SELECT * FROM change_logs WHERE user_id = $1 AND 
        password_id = $2 AND description = $3 AND timestamp >= NOW() - INTERVAL '10 seconds'`, [req.user_id, password_id, description]);
      if (recentChangeLogs.length > 0) {
        return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
      }
      let { dataKey, encryptedDataKey } = await generateDataKey();
      let updatePasswordQuery = `UPDATE passwords 
        SET service_name = $1, password_encrypted = $2, updated_at = CURRENT_TIMESTAMP, encrypted_data_key = $3 
        WHERE password_id = $4`;
      await client.query(updatePasswordQuery, [service_name, encryptPassword({password, dataKey}), encryptedDataKey, password_id]);
    
      // insert log into change_logs table.
      
      let changeLogQuery = `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`;
      await client.query(changeLogQuery, [req.user_id, password_id, description]);
      await client.query(`COMMIT`);

      console.log('SUCCESS: Password successfully updated');
      return res.status(200).json({ message: 'Password successfully updated.' });
    } else {return res.status(400).json({ error: "Error updating password. Password doesn't exist in database"});}

  } catch (error) {
    console.error('Database error: ' + error);
    await client.query(`ROLLBACK`);
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  } 
}) 

app.delete('/api/deletepassword/:id', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Delete Password request received');
  const { id: password_id } = req.params;
  // Ensures no invalid requests
  if (!password_id) { 
    return res.status(400).json( { error: 'Invalid request. Password ID needs to be provided' });
  }
  const user_id = req.user_id;
  const client = await pool.connect();
  try {

    // Makes sure that passwords aren't unintentionally deleted
    await client.query(`BEGIN`);
    const { rows: delete_query_rows } = await client.query(`SELECT * FROM change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%deleted%', user_id]);
    if (delete_query_rows.length > 0) {
      console.error('Error: Too many delete requests in a short period of time');
      return res.status(400).json( { error: 'Multiple requests within a short period of time are prohibited'} );
    }

    // Deletes password from passwords table
    const {rows: service_name_row} = await client.query(`DELETE FROM passwords WHERE password_id = $1 RETURNING service_name`, 
      [parseInt(password_id)]);
    if (service_name_row.length === 0) {
      console.error('User Error: No password found with given ID');
      return res.status(400).json( { error: 'No password found with given ID'} )
    }

    // Adds to change_log table
    let description = 'Password with service name ' + service_name_row[0].service_name + ' has been deleted.';
    await client.query(`INSERT INTO change_logs (user_id, password_id, description)
      VALUES ($1, $2, $3)`, [parseInt(user_id), parseInt(password_id), description]);
    await client.query(`COMMIT`);
    
    // Returns successful deletion
    console.log('SUCCESS: Password successfully deleted');
    return res.status(200).json({ message: 'Password successfully deleted.' });

  } catch (error) {

    // Database error
    console.error("Database error: " + error);
    await client.query(`ROLLBACK`);
    return res.status(500).json( { error: 'Server Error', details: error.message });

  } finally {
    client.release();
  }
  
})

app.get('/api/getemail', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Get Email request received');
  const user_id = req.user_id;
  if (!user_id) {
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    const {rows: email_row} = await client.query('SELECT email FROM users WHERE user_id = $1', [user_id]);
    if (email_row.length === 0) {
      console.error('ERROR: No email found with given user ID');
      return res.status(400).json( {error: 'No email found with given user ID'} );
    } else {
      console.log('SUCCESS: Email successfully retrieved');
      return res.json({email: email_row[0].email});
    }
  } catch (error) {
    console.error('ERROR: ' + error.message);
    return res.status(500).json( {error: error.message} );
  } finally {
    client.release();
  }
})

app.put('/api/updateemail', verifyToken, verifyCsrfToken, async (req,res) => {
  console.log('Update email request received');
  const {newEmail: new_email} = req.body;
  const user_id = req.user_id;
  if (!user_id) {
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: update_query_rows } = await client.query(`SELECT * FROM user_change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Email Updated%', user_id]);
    if (update_query_rows.length > 0) {
      console.error('Error: Too many update email requests in a short period of time');
      return res.status(400).json( {error: 'Multiple requests within a short period of time are prohibited'} );
    }
    const { rows: email_rows } = await client.query(`SELECT user_id from users WHERE email = $1`, [new_email]);
    if (email_rows.length > 0) {
      console.error('Error: That email is already being used for another account');
      return res.status(400).json( {error: 'That email is already being used for another account'} );
    }
    await client.query(`UPDATE users SET email = $1 WHERE user_id = $2;`, [new_email, user_id]);
    await client.query(`INSERT INTO user_change_logs (user_id, description) 
      VALUES ($1, 'Email Updated')`, [user_id]);
    await client.query(`COMMIT`);
    console.log('SUCCESS: Email successfully updated');
    return res.status(200).json( {message: 'Email successfully updated'} );
  } catch (error) {
    console.error('Database Error: ' + error.message);
    await client.query(`ROLLBACK`);
    return res.status(400).json( {error: error.message} );
  } finally {
    client.release();
  }

})

app.put('/api/updateuserpassword', verifyToken, verifyCsrfToken, async (req,res) => {
  console.log('Update user password request received');
  const {oldPassword: old_password , newPassword: new_password} = req.body;
  const user_id = req.user_id;
  if (!user_id) {
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: update_query_rows } = await client.query(`SELECT * FROM user_change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Password Updated%', user_id]);
    if (update_query_rows.length > 0) {
      console.error('Error: Too many update user password requests in a short period of time');
      return res.status(400).json( {error: 'Multiple requests within a short period of time are prohibited'} );
    }
    
    const { rows: old_password_rows } = await client.query(`SELECT password_hash FROM users 
      WHERE user_id = $1`, [user_id]);
    if (! await comparePasswords(old_password, old_password_rows[0].password_hash)) {
      return res.status(400).json( {error: 'The current password you used is incorrect'} );
    }
    const new_password_hash = await hashPassword(new_password);
    await client.query(`UPDATE users SET password_hash = $1 WHERE user_id = $2;`, [new_password_hash, user_id]);
    await client.query(`INSERT INTO user_change_logs (user_id, description) 
      VALUES ($1, $2)`, [user_id, 'Password Updated']);
    await client.query(`COMMIT`);
    console.log('SUCCESS: User Password successfully updated');
    return res.status(200).json( {message: 'User Password successfully updated'} );

  } catch (error) {
    console.error('Database Error: ' + error.message);
    await client.query(`ROLLBACK`);
    return res.status(400).json( {error: error.message} );
  } finally {
    client.release();
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});