"use strict";

var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    var token = req.headers.authorization.split(" ")[1];
    var decryptedToken = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decryptedToken.userId;
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
}; // original code