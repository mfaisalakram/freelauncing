const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'no token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
