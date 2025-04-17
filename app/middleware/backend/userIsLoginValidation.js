const jwt = require("jsonwebtoken");

const userIsLoginValidation = (req, res, next) => {
  jwt.verify(
    JSON.parse(req.signedCookies.userAllInfo).tokens,
    process.env.LOGIN_SECRET_KEY,
    function (err, decoded) {
      if (decoded) {
        next();
      } else {
        return res.send({
          error: "Request URL not found on this Server.",
        });
      }
    }
  );
};

module.exports = userIsLoginValidation;
