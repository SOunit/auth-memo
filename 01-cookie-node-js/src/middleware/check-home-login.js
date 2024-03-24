const path = require("path");

exports.checkHomeLogin = (req, res, next) => {
  // check cookie
  var homeLoginSuccess = req.cookies["home-login-success"];
  console.log({ homeLoginSuccess });

  if (!homeLoginSuccess || homeLoginSuccess === "false") {
    res.render(path.join(__dirname, "../views", "pages", "switch-to-home"));
  } else {
    next();
  }
};
