require("dotenv").config();
const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const constants = require("./constants");
const { checkLogin } = require("./middleware/check-login");
const { checkHomeLogin } = require("./middleware/check-home-login");
const jwtService = require("./services/jwtService");

const app = express();

var users = [
  {
    id: 1,
    name: "Admin",
  },
  {
    id: 2,
    name: "Staff1",
  },
  {
    id: 3,
    name: "Staff2",
  },
  {
    id: 4,
    name: "Staff3",
  },
];

app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// setup cookie
app.use(cookie());

// how express-session work
// 1. initialize: check req and see if req has uniqueSessionID cookie
// 2. if uniqueSessionID exist, populate req.session object
// 3. if not exist, initialize req.session
// 4. if session changes, set cookie to res.cookie
//
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    name: "uniqueSessionID", // name in cookie
    saveUninitialized: false,
  })
);

// route
app.get("/login", function (req, res) {
  res.render(path.join(__dirname, "views", "pages", "login"));
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Actual implementation would check values in a database
  if (email === "t@t.com" && password === "password") {
    req.session.loggedIn = true;

    var userAuthInfo = {
      canAccessHome: true,
      activeUserId: 1,
    };

    // generate jwt
    const userAuthInfoJwt = jwtService.generateRefreshToken(userAuthInfo);

    // set cookie
    res.cookie(constants.USER_AUTH_INFO_JWT, userAuthInfoJwt);
  }

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.redirect("/");
});

// protect auth route
app.use(checkLogin);

app.get("/rove", function (req, res) {
  // check if admin

  // update jwt
  var userAuthInfoToken = req.cookies[constants.USER_AUTH_INFO_JWT];
  var userAuthInfo = jwtService.verify(userAuthInfoToken);
  if (!userAuthInfo) {
    // reset token
  }

  // update permission
  userAuthInfo.canAccessHome = false;
  var token = jwtService.generateRefreshToken(userAuthInfo);

  // set cookie
  res.cookie(constants.USER_AUTH_INFO_JWT, token);

  var activeUserId = userAuthInfo.activeUserId;
  var activeUser = getUser(activeUserId);

  var loginUser = getUser(1);

  // render page
  res.render(path.join(__dirname, "views", "pages", "rove"), {
    activeUser,
    loginUser,
  });
});

function getUser(id) {
  return users.find((user) => user.id === id);
}

app.get("/switch-to-home", function (req, res) {
  res.render(path.join(__dirname, "views", "pages", "switch-to-home"));
});

app.post("/switch-to-home", function (req, res) {
  const { pinCode } = req.body;

  // Actual implementation would check values in a database
  if (pinCode === "1234") {
    var token = req.cookies[constants.USER_AUTH_INFO_JWT];
    var userAuthInfo = jwtService.verify(token);
    if (!userAuthInfo) {
      // reset token
    }

    // update token
    userAuthInfo.canAccessHome = true;
    var updatedToken = jwtService.generateRefreshToken(userAuthInfo);

    // set cookie
    res.cookie(constants.USER_AUTH_INFO_JWT, updatedToken);
  }

  res.redirect("/");
});

app.post("/switch-active-user", function (req, res) {
  var userId = +req.body.userId;

  // update token
  var token = req.cookies[constants.USER_AUTH_INFO_JWT];
  var userInfo = jwtService.verify(token);
  userInfo.activeUserId = userId;
  var updatedToken = jwtService.generateRefreshToken(userInfo);

  res.cookie(constants.USER_AUTH_INFO_JWT, updatedToken);

  res.redirect("/rove");
});

// protect home mode
app.use(checkHomeLogin);

app.get("/", function (req, res) {
  var userAuthInfoJwt = req.cookies[constants.USER_AUTH_INFO_JWT];
  var userAuthInfo = jwtService.verify(userAuthInfoJwt);

  var activeUserId = userAuthInfo.activeUserId;
  var activeUser = getUser(activeUserId);

  var loginUser = getUser(1);

  res.render(path.join(__dirname, "views", "pages", "index"), {
    activeUser,
    loginUser,
  });
});

const port = "8000";
app.listen(port, () => {
  console.log({ port });
});
