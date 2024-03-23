const express = require("express");
const app = express();

// set view engine
app.set("view engine", "ejs");

// route
app.get("/login", function (req, res) {
  res.render("pages/login");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  // Actual implementation would check values in a database
  if (email === "t@t.com" && password === "password") {
    req.session.loggedIn = true;
  }

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.render("pages/index");
});

const port = "8000";
app.listen(port, () => {
  console.log({ port });
});
