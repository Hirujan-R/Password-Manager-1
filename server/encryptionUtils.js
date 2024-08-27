const crypto = require('crypto');

function encryptPassword(password, dataKey) {
    const key = Buffer.from(dataKey);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
}

function decryptPassword(encryptedPassword, dataKey) {
    const key = Buffer.from(dataKey);
    const [ivBase64,  encryptedBase64] = encryptedPassword.split(':');
    const iv = Buffer.from(ivBase64);
    const encrypted = Buffer.from(encryptedBase64);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let password = decipher.update(encrypted, 'base64', 'utf-8');
    password += decipher.final('utf-8');
    return password;
}

module.exports = {encryptPassword, decryptPassword};