const path = require("path");
const constants = require("../constants");
const jwtService = require("../services/jwtService");

exports.checkHomeLogin = (req, res, next) => {
  var isValid = true;

  // check jwt
  var userAuthInfoJwt = req.cookies[constants.USER_AUTH_INFO_JWT];
  if (!userAuthInfoJwt) {
    isValid = false;
  }

  // verify token
  var userAuthInfo = jwtService.verify(userAuthInfoJwt);
  if (!userAuthInfo) {
    // you have token, but it is invalid
    isValid = false;
  }

  if (!userAuthInfo.canAccessHome) {
    isValid = false;
  }

  if (!isValid) {
    res.render(path.join(__dirname, "../views", "pages", "switch-to-home"));
  } else {
    // can pass to next route
    req.userAuthInfo = userAuthInfo;
    next();
  }
};
