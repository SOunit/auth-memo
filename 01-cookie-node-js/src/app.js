const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const { checkLogin } = require("./middleware/check-login");

const app = express();

app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// setup cookie
app.use(cookie());

app.use((req, res, next) => {
  var messageInCookie = req.cookies.message;
  console.log({ messageInCookie });

  res.cookie("message in cookie", "hello world!");

  next();
});

// how express-session work
// 1. initialize: check req and see if req has uniqueSessionID cookie
// 2. if uniqueSessionID exist, populate req.session object
// 3. if not exist, initialize req.session
// 4. if session changes, set cookie to res.cookie
//
app.use(
  session({
    secret: "process.env.SESSION_SECRET_KEY!",
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

    // set cookie
    res.cookie("home-login-success", "true");
  }

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.redirect("/");
});

// protect auth route
app.use(checkLogin);

app.get("/", function (req, res) {
  res.render(path.join(__dirname, "views", "pages", "index"));
});

const port = "8000";
app.listen(port, () => {
  console.log({ port });
});
