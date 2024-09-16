const crypto = require('crypto');

function encryptPassword({password, dataKey}) {

    // Buffer dataKey
    const key = Buffer.from(dataKey, 'base64');
    
    if (key.length !== 32) {
        // Throw error if key length isnt 32 bytes
        throw new RangeError('Invalid key length: AES-256 requires a 32-byte key.');
    }
    // Generate IV
    const iv = crypto.randomBytes(16);
    // Create encryption cipher  using buffered data key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    // Encrypt password
    let encrypted = cipher.update(password, 'utf-8', 'base64');
    encrypted += cipher.final('base64');

    return `${iv.toString('base64')}:${encrypted}`;
}

function decryptPassword(encryptedPassword, dataKey) {

    // Buffer dataKey
    const key = Buffer.from(dataKey, 'base64');
    if (key.length !== 32) {
        // Throw error if key length isnt 32 bytes
        throw new RangeError('Invalid key length: AES-256 requires a 32-byte key.');
    }
    // Retrieve IV from encrypted password
    const [ivBase64,  encryptedBase64] = encryptedPassword.split(':');
    // Buffer IV
    const iv = Buffer.from(ivBase64, 'base64');
    // Buffer encrypted password
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    // Create decryption cipher using buffered iv and data key
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    // Decrypt buffered encrypted password
    let password = decipher.update(encrypted, 'base64', 'utf-8');
    password += decipher.final('utf-8');
    
    return password;
}

module.exports = {encryptPassword, decryptPassword};