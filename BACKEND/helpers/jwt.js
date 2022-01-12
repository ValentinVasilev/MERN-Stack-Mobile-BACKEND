const expressJWT = require("express-jwt");

function authJWT() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return expressJWT({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // Here we tell the API what methods this URL can take
      {
        url: /\/api\/v1\/products(.*)/, // This Regex is a MUST, because without it URL like: "/get/featured/:count" will not be accessible
        methods: ["GET", "OPTIONS"],
      },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },

      // Here we exclude routes to be Authenticated
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

// payload contains the data in the token
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}
module.exports = authJWT;
