const jwt = require("jsonwebtoken");
var secret = require("../configs").secret;

//p) UC-101, Av0-101 .. This middleware is responsible to validate user's token for each API call

module.exports = function (req, res, next) {
  const token = req.header("cooljwt");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.secret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};
