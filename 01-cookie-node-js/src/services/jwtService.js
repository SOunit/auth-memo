const jwt = require("jsonwebtoken");

function generateAccessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
}

function verify(token) {
  var result = null;
  try {
    result = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("Failed to verify JWT");
  }

  return result;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verify,
};
