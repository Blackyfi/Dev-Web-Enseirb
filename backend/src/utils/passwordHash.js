const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

async function comparePassword(plainPassword, hash) {
  const match = await bcrypt.compare(plainPassword, hash);
  return match;
}

module.exports = {
  hashPassword,
  comparePassword
};
