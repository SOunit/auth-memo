const path = require("path");

exports.checkLogin = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.render(path.join(__dirname, "../views", "pages", "login"));
  } else {
    next();
  }
};
