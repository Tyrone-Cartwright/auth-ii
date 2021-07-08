const jwt = require("jsonwebtoken");

function protected(req, res, next) {
  // the auth token is normally sent in the Authorization header
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No authorized token" });
  }
}

function checkRole(role) {
  return function(req, res, next) {
    if (req.decodedToken.roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: `You need to be an ${role}` });
    }
  };
}

module.exports = { protected, checkRole };
