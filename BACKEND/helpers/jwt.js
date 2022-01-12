const expressJWT = require("express-jwt");

function authJWT() {
  const secret = process.env.SECRET;
  return expressJWT({
    secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJWT;
