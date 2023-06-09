const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. Token not provided" });
  }

  try {
    const verified = jwt.verify(token, JWT_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;