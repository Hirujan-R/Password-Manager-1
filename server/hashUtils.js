const bcrypt = require('bcryptjs'); 

// Hashing user password
async function hashPassword(password) {
    const saltRounds = 10; // Number of times we peform hashing process
    const hashedPassord = await bcrypt.hash(password, saltRounds);
    return hashedPassord;
}
  
// Comparing password hash from server with inputted user password
async function comparePasswords( password, hashedPassord ) {
    return await bcrypt.compare(password, hashedPassord);
}

module.exports = { hashPassword, comparePasswords };