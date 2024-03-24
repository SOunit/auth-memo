require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5555;

app.use(express.json());

// only for demo purpose
// stored in database / redis cache in production
// needs to be persistence
let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }

    const accessToken = generateAccessToken({ name: user.name });

    res.json({ accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  // this here is auth code, but auth is another topic,
  // this here just focus only on jwt

  // 1. Build Node.js User Authentication - Password Login
  // https://www.youtube.com/watch?v=Ud5xKCYQTjM&t=0s

  // 2. What Is JWT and Why Should You Use JWT
  // https://www.youtube.com/watch?v=7Q17ubqLfaM

  // Authenticate user
  // 1. access db with email / password
  // 2. get user if success
  // 3. get error if user not exist

  const userName = req.body.userName;
  const user = { name: userName };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

app.listen(PORT, () => {
  console.log(`listen on ${PORT}`);
});
