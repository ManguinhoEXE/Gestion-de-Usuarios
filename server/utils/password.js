const bcrypt = require('bcryptjs');

const ROUNDS = 10;

exports.hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(ROUNDS);
  return bcrypt.hash(plain, salt);
};

exports.verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);