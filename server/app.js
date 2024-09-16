const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const csrf = require('csrf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { hashPassword, comparePasswords } = require('./hashUtils.js');
const { generateDataKey, decryptDataKey } = require('./kmsUtils.js');
const { encryptPassword, decryptPassword } = require('./encryptionUtils.js');
dotenv.config();

// Middleware
const app = express();
app.use(helmet());
const port = parseInt(process.env.PORT, 10) || 3000;

const csrfProtection = csrf({ secret: process.env.CSRF_SECRET });
const tokens = new csrf();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true, 
}));



const verifyToken = (req, res, next) => {
  //Verifies that there is a valid and unexpired JWT 
  const token = req.cookies.token;
  if (!token) {
    // Returns error if there is no JWT
    console.log("ERROR: JWT token is missing.");
    return res.status(400).json({ error: "Unauthorised" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    // JWT is successfully verified
    console.log("SUCCESS: Successful verification of JWT token");
    next();
  } catch (error) {
    // Returns error if JWT is expired
    console.log("ERROR: Invalid JWT token.");
    return res.status(400).json({ error: "Unauthorised" });
  }
}

const verifyCsrfToken = (req, res, next) => {
  //Verifies that there is a valid and unexpired CSRF TOKEN
  const csrfToken = req.cookies.csrfToken;
  if (!csrfToken) {
    // Returns error if there is no CSRF Token
    console.log("ERROR: CSRF token is missing.");
    return res.status(400).json({ error: "Unauthorised" });
  }
  try {
    if (tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
      // CSRF Token is verified
      console.log("SUCCESS: Successful verification of CSRF token");
      next();
    } else {
      // Returns error if CSRF token is expired
      console.log("ERROR: Invalid CSRF token.");
      return res.status(400).json({ error: "Unauthorised" });
    }
  } catch (error) {
    // Returns error if an error is caught while verifying CSRF token
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
  // API route for registering users
  console.log('Registration request received');
  const { email, password } = req.body;

  if (!email || !password) {
    // Returns error if email or password is missing
    console.log('Error: Email and password are required');
    return res.status(400).json({ error: 'Email and password are required'});
  }

  const client = await pool.connect();
  try {
    //Checks if user already exists
    const {rows} = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (rows.length > 0) {
      // Returns error if user already exists
      console.log('Error: User with this email already exists');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Creates a hash from password using bcrypt hashing algorithm
    let password_hash = await hashPassword(password);

    //Stores newly registered user details in db
    const result = await client.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id`, [email, password_hash]);
    console.log('SUCCESS: User registered successfully.');

    // Successful registration
    return res.status(200).json({ message: 'User registered successfully', user_id : result.rows[0].user_id });

  } catch (error) {
    console.error('Database error:', error);   
    // Returns error if there is an error with db
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/login', async (req, res) => {
  console.log("Login request received")
  const {email, password} = req.body;
  if (!email || !password) {
    // Returns error if no email or password
    console.error("Error: Email or password is missing.");
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const client = await pool.connect();
  try {
    // Retrieves user details
    const {rows} = await client.query(`SELECT user_id, password_hash FROM users WHERE email = $1`, [email]);
    console.log("Database query result:", rows);
    if (rows.length === 0) {
      // Returns error if no user_details are retrieved, i.e. user doesnt exist
      console.error("Error: User does not exist.");
      return res.status(400).json({ error: 'Incorrect username or password' });
    }
    console.log("Existance of user with inputted email is confirmed.");
    // Verifies password by comparing retrieved password hash to inputted password
    if (await comparePasswords(password, rows[0].password_hash)) {
      // User successfully logged in
      console.log("SUCCESS: User logged in successfully");


      // Create JWT token
      const token = jwt.sign({ user_id: rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Create CSRF token
      const csrfToken = tokens.create(process.env.CSRF_SECRET);

      // Set tokens
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
      // Returns error if incorrect password provided
      console.log("ERROR: Incorrect password");
      return res.status(400).json({ error: 'Incorrect username or password' });
    } 
  } catch (error) {
    // Returns error if there is an error with db
    console.error('Database error:', error);  
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
    client.release();
  }
});

app.post('/api/removecookies', async (req, res) => {
  console.log('Remove Cookies request received');
  // Set tokens to expire now so that they become invalid
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
    // Retrieve all user passwords
    const {rows} = await client.query(`SELECT password_id, service_name, password_encrypted, encrypted_data_key FROM passwords 
      WHERE user_id = $1 ORDER BY created_at`, [req.user_id]);
    if (rows.length === 0) {
      // If no passwords retrieved return message 'no passwords'
      return res.status(200).json({ message: 'No Passwords' });
    }
    // Decrypt all passwords by decrypting the retrieved encrypted data key and using it for the AES-256 decryption
    const password_rows = await Promise.all(rows.map(async (row) => {
      if (row.encrypted_data_key) { 
        // If encrypted data key successfully retrieved
        const decryptedDataKey = await decryptDataKey(row.encrypted_data_key);
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: decryptPassword(row.password_encrypted, decryptedDataKey)
        }
      } else {
        // Return error if failed to retrieve encrypted data key
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: 'Error retrieving password. Please delete the password'
        }
      }
    }));
    // Passwords successfully retrieved
    console.log('SUCCESS: Passwords retrieved');
    return res.status(200).json({ message: 'Passwords retrieved', passwords: password_rows });
  } catch (error) {
    // Return error if there is error with db
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Server error' , details: error.message });
  } finally {
      client.release();
  }
})

app.post('/api/createpassword', verifyCsrfToken, verifyToken, async (req, res) => {
  console.log('Create Password request received');
  const {service_name, password} = req.body;
  // Return error if missing service name or password
  if (!service_name || !password) {
    return res.status(400).json({ error: 'Invalid request. Service name and password need to be provided' });
  } 

  const client = await pool.connect();
  try {
    // Generating data key from AWS KMS to use for encryption
    const {dataKey: data_key, encryptedDataKey: encrypted_data_key} = await generateDataKey();
    await client.query(`BEGIN`);
    /*Encrypting passwords using AES-256 encryption with data key and 
    storing password details and encrypted version of data key in db*/
    const {rows: password_id_row} = await client.query(`INSERT INTO passwords (user_id, service_name, password_encrypted, encrypted_data_key) 
      VALUES ($1, $2, $3, $4) RETURNING password_id`, 
      [req.user_id, service_name, encryptPassword({password, dataKey: data_key}), encrypted_data_key]);

    // Insert log into change_logs table
    let description = 'Password with service name ' + service_name + ' has been created.';
    let changeLogQuery = `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`;
    await client.query(changeLogQuery, [parseInt(req.user_id,10), parseInt(password_id_row[0].password_id), description]);
    await client.query(`COMMIT`);

    // Password successfully created
    console.log('SUCCESS: Password successfully created');
    return res.status(200).json({ message: 'Password successfully created.' });
  } catch (error) {
    // Return error if error with db
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
    // Return error if missing password_id, service_name, or password
    return res.status(400).json({ error: 'Invalid request. Password ID, service name and password need to be provided' });
  } 
  
  const client = await pool.connect();
  try {

    await client.query(`BEGIN`);
    // Retrieve password that needs to be updated from db
    const {rows: password_rows} = await client.query(`SELECT service_name from passwords WHERE password_id = $1`, [password_id]);
    if (password_rows.length > 0) {
      let description = 'Password with service name ' + password_rows[0].service_name + ' has been updated.';
      // Ensure password hasn't been updated recently to prevent repetitive changes
      const {rows: recentChangeLogs} = await client.query(`SELECT * FROM change_logs WHERE user_id = $1 AND 
        password_id = $2 AND description = $3 AND timestamp >= NOW() - INTERVAL '5 seconds'`, [req.user_id, password_id, description]);
      if (recentChangeLogs.length > 0) {
        // If password has been updated recently return error reminding client to wait before reupdating same password
        return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
      }
      // Generate new data key using AWS KMS
      let { dataKey, encryptedDataKey } = await generateDataKey();

      // Encrypted inputted password with AES-256 and new data key and store updated details in db
      let updatePasswordQuery = `UPDATE passwords 
        SET service_name = $1, password_encrypted = $2, updated_at = CURRENT_TIMESTAMP, encrypted_data_key = $3 
        WHERE password_id = $4`;
      await client.query(updatePasswordQuery, [service_name, encryptPassword({password, dataKey}), encryptedDataKey, password_id]);
    
    
      // insert update log into change_logs table.  
      let changeLogQuery = `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`;
      await client.query(changeLogQuery, [req.user_id, password_id, description]);
      await client.query(`COMMIT`);

      // Password successfully updated
      console.log('SUCCESS: Password successfully updated');
      return res.status(200).json({ message: 'Password successfully updated.' });
    } else {return res.status(400).json({ error: "Error updating password. Password doesn't exist in database"});}

  } catch (error) {
    // Return error if there is an error with db
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
  if (!password_id) { 
    // Retuns error if password_id isn't included in query
    return res.status(400).json( { error: 'Invalid request. Password ID needs to be provided' });
  }
  const user_id = req.user_id;
  const client = await pool.connect();
  try {
    await client.query(`BEGIN`);
    // Check to see if any passwords deleted recently
    const { rows: delete_query_rows } = await client.query(`SELECT * FROM change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%deleted%', user_id]);
    if (delete_query_rows.length > 0) {
      // Return error if another password deleted recently reminding client to wait before deleting another password
      console.error('Error: Too many delete requests in a short period of time');
      return res.status(400).json( { error: 'Multiple requests within a short period of time are prohibited'} );
    }

    // Deletes password from passwords table
    const {rows: service_name_row} = await client.query(`DELETE FROM passwords WHERE password_id = $1 RETURNING service_name`, 
      [parseInt(password_id)]);
    if (service_name_row.length === 0) {
      // Returns error if password with provided password_id doesn't exist
      console.error('User Error: No password found with given ID');
      return res.status(400).json( { error: 'No password found with given ID'} )
    }

    // Adds delete log to change_log table
    let description = 'Password with service name ' + service_name_row[0].service_name + ' has been deleted.';
    await client.query(`INSERT INTO change_logs (user_id, password_id, description)
      VALUES ($1, $2, $3)`, [parseInt(user_id), parseInt(password_id), description]);
    await client.query(`COMMIT`);
    
    // Returns successful deletion
    console.log('SUCCESS: Password successfully deleted');
    return res.status(200).json({ message: 'Password successfully deleted.' });

  } catch (error) {

    // Return error if db error
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
    // Return error if no user id provided
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    // Retrieve email from db
    const {rows: email_row} = await client.query('SELECT email FROM users WHERE user_id = $1', [user_id]);
    if (email_row.length === 0) {
      // Return error if no email is associated with provided user id
      console.error('ERROR: No email found with given user ID');
      return res.status(400).json( {error: 'No email found with given user ID'} );
    } else {
      // Email successfully retrieved
      console.log('SUCCESS: Email successfully retrieved');
      return res.json({email: email_row[0].email});
    }
  } catch (error) {
    // Return error if there is error with db or any other error
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
    // Return error if no user id provided
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check if email has been updated recently
    const { rows: update_query_rows } = await client.query(`SELECT * FROM user_change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Email Updated%', user_id]);
    if (update_query_rows.length > 0) {
      // Return error if email has been updated recently
      console.error('Error: Too many update email requests in a short period of time');
      return res.status(400).json( {error: 'Multiple requests within a short period of time are prohibited'} );
    }
    // Check to see if the inputted email is being used by another user
    const { rows: email_rows } = await client.query(`SELECT user_id from users WHERE email = $1`, [new_email]);
    if (email_rows.length > 0) {
      // Return error if email is being used by another user
      console.error('Error: That email is already being used for another account');
      return res.status(400).json( {error: 'That email is already being used for another account'} );
    }
    // Store new email in db
    await client.query(`UPDATE users SET email = $1 WHERE user_id = $2;`, [new_email, user_id]);
    // Insert update log into user change logs
    await client.query(`INSERT INTO user_change_logs (user_id, description) 
      VALUES ($1, 'Email Updated')`, [user_id]);
    await client.query(`COMMIT`);
    // Email successfully updated
    console.log('SUCCESS: Email successfully updated');
    return res.status(200).json( {message: 'Email successfully updated'} );
  } catch (error) {
    // Return error if there is error with db
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
    // Returns error if no user id provided
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check if user password has been updated recently
    const { rows: update_query_rows } = await client.query(`SELECT * FROM user_change_logs 
      WHERE description ILIKE $1 AND user_id = $2 AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Password Updated%', user_id]);
    if (update_query_rows.length > 0) {
      // Return error if user password has been updated recently
      console.error('Error: Too many update user password requests in a short period of time');
      return res.status(400).json( {error: 'Multiple requests within a short period of time are prohibited'} );
    }
    
    // Check if old password provided by user is valid by comparing it to password hash stored in db
    const { rows: old_password_rows } = await client.query(`SELECT password_hash FROM users 
      WHERE user_id = $1`, [user_id]);
    if (! await comparePasswords(old_password, old_password_rows[0].password_hash)) {
      // Return error if old password provided by user is invalid
      return res.status(400).json( {error: 'The current password you used is incorrect'} );
    }
    // Create a hash from new password
    const new_password_hash = await hashPassword(new_password);

    // Store new password hash in db  
    await client.query(`UPDATE users SET password_hash = $1 WHERE user_id = $2;`, [new_password_hash, user_id]);

    // Insert update user password log into user_change_logs
    await client.query(`INSERT INTO user_change_logs (user_id, description) 
      VALUES ($1, $2)`, [user_id, 'Password Updated']);
    await client.query(`COMMIT`);

    // User password successfully updated
    console.log('SUCCESS: User Password successfully updated');
    return res.status(200).json( {message: 'User Password successfully updated'} );

  } catch (error) {
    // Return error if db error
    console.error('Database Error: ' + error.message);
    await client.query(`ROLLBACK`);
    return res.status(400).json( {error: error.message} );
  } finally {
    client.release();
  }

})

app.delete('/api/deleteuser', verifyToken, verifyCsrfToken, async (req,res) => {
  console.log('Delete account request received');
  const user_id = req.user_id;
  if (!user_id) {
    // Return error no user id provided
    console.error('ERROR: No user ID provided');
    return res.status(400).json( {error: 'No user ID provided'} );
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete passwords stored by user from db
    await client.query(`DELETE FROM passwords WHERE user_id = $1`, [user_id]);
    // Delete user from db
    await client.query(`DELETE FROM users WHERE user_id = $1`, [user_id]);
    // Insert delete log into user change logs
    await client.query(`INSERT INTO user_change_logs (user_id, description) 
      VALUES ($1, $2)`, [user_id, 'Account Deleted']);
    await client.query(`COMMIT`);
    // Account successfully deleted
    console.log('SUCCESS: Account successfully deleted');
    return res.status(200).json( {message: 'Account successfully deleted'} );
  } catch (error) {
    // Return error if there is error with db or other error
    console.error('Error: ' + error.message);
    await client.query(`ROLLBACK`);
    return res.status(500).json( {error: error.message} );
  } finally {
    client.release();
  }

})


module.exports = { app, pool };

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
