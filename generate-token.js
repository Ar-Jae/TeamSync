const jwt = require('jsonwebtoken');

const payload = {
  id: '682797672bc298d857c970de',
  email: 'ethan.brooks56@example.com'
};

const secret = 'mysecretkey-bit-by-bit';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log(token);
