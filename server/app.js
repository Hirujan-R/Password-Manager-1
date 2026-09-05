const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { hashPassword, comparePasswords } = require('./hashUtils.js');
const { generateDataKey, decryptDataKey } = require('./kmsUtils.js');
const { encryptPassword, decryptPassword } = require('./encryptionUtils.js');
const {
  setSessionCookie,
  setCsrfCookie,
  clearAuthCookies,
  verifyToken,
  verifyCsrfToken,
  issueCsrfToken,
  normalizeEmail,
  isWeakPassword,
} = require('./middleware.js');
const { makeRateLimiter } = require('./rateLimiter.js');

dotenv.config();

const app = express();
app.use(helmet());
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
  max: 20,
});

// Brute-force / enumeration protection on the two unauthenticated endpoints.
const authRateLimiter = makeRateLimiter({ max: 10, windowMs: 15 * 60 * 1000, accountField: 'email' });

function serverError(res, message = 'Server error') {
  return res.status(500).json({ error: message });
}

// ---------------------------------------------------------------------------
// Registration & login (no CSRF required - nothing to protect cross-site yet)
// ---------------------------------------------------------------------------

app.post('/api/registration', authRateLimiter, async (req, res) => {
  const { email: rawEmail, password } = req.body;
  const email = normalizeEmail(rawEmail);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (isWeakPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      'SELECT user_id FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      // Generic message on purpose - do not reveal whether the address exists.
      return res.status(400).json({ error: 'Registration failed. Please try again.' });
    }

    const password_hash = await hashPassword(password);
    const result = await client.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id`,
      [email, password_hash]);

    console.log('SUCCESS: User registered successfully.');
    return res.status(200).json({ message: 'User registered successfully', user_id: result.rows[0].user_id });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') {
      // Unique-constraint race with a concurrent registration.
      return res.status(400).json({ error: 'Registration failed. Please try again.' });
    }
    return serverError(res);
  } finally {
    client.release();
  }
});

app.post('/api/login', authRateLimiter, async (req, res) => {
  const { email: rawEmail, password } = req.body;
  const email = normalizeEmail(rawEmail);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      'SELECT user_id, password_hash FROM users WHERE email = $1', [email]);
    if (rows.length === 0 || !(await comparePasswords(password, rows[0].password_hash))) {
      // Single generic message for unknown user AND wrong password (no enumeration).
      return res.status(400).json({ error: 'Incorrect username or password' });
    }

    const token = require('jsonwebtoken').sign(
      { user_id: rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const csrfToken = issueCsrfToken();

    setSessionCookie(res, token);
    setCsrfCookie(res, csrfToken);

    console.log('SUCCESS: User logged in successfully');
    return res.status(200).json({ message: 'User logged in successfully', csrfToken });
  } catch (error) {
    console.error('Login error:', error);
    return serverError(res);
  } finally {
    client.release();
  }
});

app.post('/api/removecookies', (req, res) => {
  // Clear BOTH cookies (names must match what /api/login set).
  clearAuthCookies(res);
  console.log('SUCCESS: Cookies successfully removed');
  return res.status(200).json({ message: 'Successfully logged out' });
});

// A signed CSRF token is issued at login and refreshed here if the client ever
// reloads a protected page and lost the in-memory value (cookie is re-issued too).
app.get('/api/csrftoken', verifyToken, (req, res) => {
  const csrfToken = issueCsrfToken();
  setCsrfCookie(res, csrfToken);
  return res.json({ csrfToken });
});

// ---------------------------------------------------------------------------
// Password CRUD (CSRF + JWT protected, ownership-scoped)
// ---------------------------------------------------------------------------

app.get('/api/getpasswords', verifyCsrfToken, verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT password_id, service_name, password_encrypted, encrypted_data_key
       FROM passwords WHERE user_id = $1 ORDER BY created_at`, [req.user_id]);
    if (rows.length === 0) {
      return res.status(200).json({ message: 'No Passwords' });
    }

    const password_rows = await Promise.all(rows.map(async (row) => {
      if (row.encrypted_data_key) {
        const decryptedDataKey = await decryptDataKey(row.encrypted_data_key);
        return {
          password_id: row.password_id,
          service_name: row.service_name,
          password: decryptPassword(row.password_encrypted, decryptedDataKey),
        };
      }
      return {
        password_id: row.password_id,
        service_name: row.service_name,
        password: 'Error retrieving password. Please delete the password',
      };
    }));

    console.log('SUCCESS: Passwords retrieved');
    return res.status(200).json({ message: 'Passwords retrieved', passwords: password_rows });
  } catch (error) {
    console.error('Database error:', error);
    return serverError(res);
  } finally {
    client.release();
  }
});

app.post('/api/createpassword', verifyCsrfToken, verifyToken, async (req, res) => {
  const { service_name, password } = req.body;
  if (!service_name || !password) {
    return res.status(400).json({ error: 'Invalid request. Service name and password need to be provided' });
  }

  const client = await pool.connect();
  try {
    const { dataKey, encryptedDataKey } = await generateDataKey();
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO passwords (user_id, service_name, password_encrypted, encrypted_data_key)
       VALUES ($1, $2, $3, $4) RETURNING password_id`,
      [req.user_id, service_name, encryptPassword({ password, dataKey }), encryptedDataKey]);

    await client.query(
      `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`,
      [parseInt(req.user_id, 10), parseInt(rows[0].password_id, 10),
        `Password with service name ${service_name} has been created.`]);
    await client.query('COMMIT');

    console.log('SUCCESS: Password successfully created');
    return res.status(200).json({ message: 'Password successfully created.' });
  } catch (error) {
    console.error('Create password error:', error);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

app.put('/api/updatepassword', verifyCsrfToken, verifyToken, async (req, res) => {
  const { password_id, service_name, password } = req.body;
  if (!password_id || !service_name || !password) {
    return res.status(400).json({ error: 'Invalid request. Password ID, service name and password need to be provided' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ownership is enforced on EVERY query for this row (IDOR fix).
    const { rows: password_rows } = await client.query(
      `SELECT service_name FROM passwords WHERE password_id = $1 AND user_id = $2`,
      [password_id, req.user_id]);
    if (password_rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Error updating password. Password doesn't exist" });
    }

    const description = `Password with service name ${password_rows[0].service_name} has been updated.`;
    const { rows: recentChangeLogs } = await client.query(
      `SELECT * FROM change_logs WHERE user_id = $1 AND password_id = $2
       AND description = $3 AND timestamp >= NOW() - INTERVAL '5 seconds'`,
      [req.user_id, password_id, description]);
    if (recentChangeLogs.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
    }

    const { dataKey, encryptedDataKey } = await generateDataKey();
    await client.query(
      `UPDATE passwords
       SET service_name = $1, password_encrypted = $2, updated_at = CURRENT_TIMESTAMP, encrypted_data_key = $3
       WHERE password_id = $4 AND user_id = $5`,
      [service_name, encryptPassword({ password, dataKey }), encryptedDataKey, password_id, req.user_id]);

    await client.query(
      `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`,
      [req.user_id, password_id, description]);
    await client.query('COMMIT');

    console.log('SUCCESS: Password successfully updated');
    return res.status(200).json({ message: 'Password successfully updated.' });
  } catch (error) {
    console.error('Update password error:', error);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

app.delete('/api/deletepassword/:id', verifyCsrfToken, verifyToken, async (req, res) => {
  const { id: password_id } = req.params;
  if (!password_id) {
    return res.status(400).json({ error: 'Invalid request. Password ID needs to be provided' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: delete_query_rows } = await client.query(
      `SELECT * FROM change_logs WHERE description ILIKE $1 AND user_id = $2
       AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%deleted%', req.user_id]);
    if (delete_query_rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
    }

    // Ownership enforced on the DELETE itself (IDOR fix).
    const { rows: service_name_row } = await client.query(
      `DELETE FROM passwords WHERE password_id = $1 AND user_id = $2 RETURNING service_name`,
      [parseInt(password_id, 10), req.user_id]);
    if (service_name_row.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No password found with given ID' });
    }

    await client.query(
      `INSERT INTO change_logs (user_id, password_id, description) VALUES ($1, $2, $3)`,
      [parseInt(req.user_id, 10), parseInt(password_id, 10),
        `Password with service name ${service_name_row[0].service_name} has been deleted.`]);
    await client.query('COMMIT');

    console.log('SUCCESS: Password successfully deleted');
    return res.status(200).json({ message: 'Password successfully deleted.' });
  } catch (error) {
    console.error('Delete password error:', error);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

// ---------------------------------------------------------------------------
// Account management (email / master-password changes, account deletion)
// ---------------------------------------------------------------------------

app.get('/api/getemail', verifyCsrfToken, verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT email FROM users WHERE user_id = $1', [req.user_id]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'No email found with given user ID' });
    }
    return res.json({ email: rows[0].email });
  } catch (error) {
    console.error('Get email error:', error.message);
    return serverError(res);
  } finally {
    client.release();
  }
});

app.put('/api/updateemail', verifyToken, verifyCsrfToken, async (req, res) => {
  const new_email = normalizeEmail(req.body && req.body.newEmail);
  if (!new_email) {
    return res.status(400).json({ error: 'No email provided' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: update_query_rows } = await client.query(
      `SELECT * FROM user_change_logs WHERE description ILIKE $1 AND user_id = $2
       AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Email Updated%', req.user_id]);
    if (update_query_rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
    }

    const { rows: email_rows } = await client.query('SELECT user_id FROM users WHERE email = $1', [new_email]);
    if (email_rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'That email is already being used for another account' });
    }

    await client.query('UPDATE users SET email = $1 WHERE user_id = $2', [new_email, req.user_id]);
    await client.query("INSERT INTO user_change_logs (user_id, description) VALUES ($1, 'Email Updated')", [req.user_id]);
    await client.query('COMMIT');

    console.log('SUCCESS: Email successfully updated');
    return res.status(200).json({ message: 'Email successfully updated' });
  } catch (error) {
    console.error('Update email error:', error.message);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

app.put('/api/updateuserpassword', verifyToken, verifyCsrfToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both the current and new password are required' });
  }
  if (isWeakPassword(newPassword)) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: update_query_rows } = await client.query(
      `SELECT * FROM user_change_logs WHERE description ILIKE $1 AND user_id = $2
       AND timestamp >= NOW() - INTERVAL '5 seconds'`, ['%Password Updated%', req.user_id]);
    if (update_query_rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Multiple requests within a short period of time are prohibited' });
    }

    const { rows: old_password_rows } = await client.query(
      'SELECT password_hash FROM users WHERE user_id = $1', [req.user_id]);
    if (old_password_rows.length === 0 || !(await comparePasswords(oldPassword, old_password_rows[0].password_hash))) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'The current password you used is incorrect' });
    }

    const new_password_hash = await hashPassword(newPassword);
    await client.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [new_password_hash, req.user_id]);
    await client.query("INSERT INTO user_change_logs (user_id, description) VALUES ($1, 'Password Updated')", [req.user_id]);
    await client.query('COMMIT');

    console.log('SUCCESS: User password successfully updated');
    return res.status(200).json({ message: 'User Password successfully updated' });
  } catch (error) {
    console.error('Update user password error:', error.message);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

app.delete('/api/deleteuser', verifyToken, verifyCsrfToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM passwords WHERE user_id = $1', [req.user_id]);
    await client.query('DELETE FROM users WHERE user_id = $1', [req.user_id]);
    await client.query("INSERT INTO user_change_logs (user_id, description) VALUES ($1, 'Account Deleted')", [req.user_id]);
    await client.query('COMMIT');

    clearAuthCookies(res);
    console.log('SUCCESS: Account successfully deleted');
    return res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Delete account error:', error.message);
    await client.query('ROLLBACK');
    return serverError(res);
  } finally {
    client.release();
  }
});

module.exports = { app, pool };

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
