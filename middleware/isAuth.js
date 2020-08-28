const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const bearer = req.get("Authorization");

  if (!bearer) {
    throw new Error("Bearer token not found");
  }

  const token = bearer.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, decoded) => {
    if (err) {
      res.status(403);
      throw err;
    }
    req.username = decoded.username;
  });

  next();
};
