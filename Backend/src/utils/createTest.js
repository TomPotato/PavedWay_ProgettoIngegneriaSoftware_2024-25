const jwt = require('jsonwebtoken');
const  Admin  = require('../models/Admin');

async function createTestAdmin() {
  const admin = new Admin({
    username: 'admin_test',
    name: 'Mario',
    surname: 'Rossi',
    password: 'password123', 
    office: 'Ufficio Test',
  });

  await admin.save();

  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.username,
      role: 'admin',
    },
    process.env.JWT_SECRET || 'testsecret',
    { expiresIn: '1h' }
  );

  return { admin, token };
}

module.exports = createTestAdmin;
