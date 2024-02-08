const jwt = require('jsonwebtoken');
const util = require('util');
const users = require('../models/model');

const SECRET_KEY = 'your-secret-key';


const verifyJwt = util.promisify(jwt.verify);

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  try {
    if (!token) throw new Error("Token not provided");

    const user = await verifyJwt(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.sendStatus(403);
    }
  }
};


const login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) return res.sendStatus(401);

  const token = jwt.sign(user, SECRET_KEY);
  res.json({ token });
};

module.exports = { authenticateToken, login };
