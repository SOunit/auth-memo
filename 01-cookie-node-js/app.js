const express = require("express");
const app = express();

// set view engine
app.set("view engine", "ejs");

// route
app.get("/", function (req, res) {
  res.render("pages/index");
});

const port = "8000";
app.listen(port, () => {
  console.log({ port });
});
