"use strict";

var router = require("express").Router();

var User = require("../models/userModel");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var authMiddleware = require("../middlewares/authMiddleware"); // new


var _require = require("express-validator"),
    check = _require.check,
    validationResult = _require.validationResult;

var nodemailer = require('nodemailer');

require('dotenv').config();

var Token = require("../models/token");

var crypto = require("crypto"); // for ejs template 
// app.set('view engine', 'ejs')
// zedthoom ghy db bch nder delete account 


var cookieParser = require('cookie-parser'); // Create Nodemailer Transporter


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    // replace with your email
    pass: process.env.EMAIL_PASS // replace with your email password

  },
  tls: {
    rejectUnauthorized: true
  }
}); // Create a Function to Send the Email

var sendWelcomeEmail = function sendWelcomeEmail(userEmail, url) {
  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Welcome to Our Service',
    text: "Thank you for registering with our service. We are excited to have you on board!, ".concat(url)
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}; // register a new user


router.post("/register", [check("email", "Please provide a valid email").isEmail(), check("password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)], function _callee(req, res) {
  var objError, i, element, userExists, salt, hashedPassword, user, token, url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          objError = validationResult(req); // console.log(objError.errors);

          if (!(objError.errors.length > 0)) {
            _context.next = 13;
            break;
          }

          i = 0;

        case 4:
          if (!(i < objError.errors.length)) {
            _context.next = 13;
            break;
          }

          element = objError.errors[i];

          if (!(element.path === 'email')) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.send({
            success: false,
            message: "The email address you entered is not in a valid format. Please enter a valid email address (e.g., user@example.com)."
          }));

        case 8:
          if (!(element.path === 'password')) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.send({
            success: false,
            message: "The password you entered is too weak. Please choose a password that is at least 8 characters long and includes a mix of letters, numbers, and special characters."
          }));

        case 10:
          i++;
          _context.next = 4;
          break;

        case 13:
          // hada zedto hna bch nsared l server email dyal luser *****************************************************
          req.app.set('userEmail', req.body.email); // *************************************************************************************
          // check if the user already exists

          _context.next = 16;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 16:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 19;
            break;
          }

          throw new Error("User already exists");

        case 19:
          if (!(req.body.password !== req.body.confirmPassword)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.send({
            success: false,
            message: "Passwords do not match"
          }));

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 23:
          salt = _context.sent;
          _context.next = 26;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

        case 26:
          hashedPassword = _context.sent;
          req.body.password = hashedPassword; // save the user

          user = new User(req.body);
          _context.next = 31;
          return regeneratorRuntime.awrap(user.save());

        case 31:
          _context.next = 33;
          return regeneratorRuntime.awrap(new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
          }).save());

        case 33:
          token = _context.sent;
          // const url = `${process.env.FRONTEND_URL}/verified`;
          url = "".concat(process.env.BASE_URL, "users/665a6ba3ac2c3f4d4a4d49f8/verify/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53");
          sendWelcomeEmail(user.email, url);
          res.send({
            success: true,
            message: "User registered successfully, and email has send to your account"
          });
          _context.next = 42;
          break;

        case 39:
          _context.prev = 39;
          _context.t0 = _context["catch"](0);
          res.send({
            success: false,
            message: _context.t0.message
          });

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 39]]);
}); // login a user

router.post("/login", function _callee2(req, res) {
  var user, passwordCorrect, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          throw new Error("User does not exist");

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 8:
          passwordCorrect = _context2.sent;

          if (passwordCorrect) {
            _context2.next = 11;
            break;
          }

          throw new Error("Invalid password");

        case 11:
          if (user.verified) {
            _context2.next = 13;
            break;
          }

          throw new Error("Verify your email please");

        case 13:
          if (!user.isDesable) {
            _context2.next = 15;
            break;
          }

          throw new Error("Your account has been deactivated.<a href='/'>Click here to reactivate</a>.");

        case 15:
          // *************************************************
          // create and assign a token
          token = jwt.sign({
            userId: user._id
          }, process.env.jwt_secret, {
            expiresIn: "1d"
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 86400000
          }); // for online 

          user.online = true;
          _context2.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          res.send({
            success: true,
            data: token,
            message: "User logged in successfully"
          });
          _context2.next = 26;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          res.send({
            success: false,
            message: _context2.t0.message
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
}); // get logged in user

router.get("/get-logged-in-user", authMiddleware, function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.body.userId
          }));

        case 3:
          user = _context3.sent;
          // remove the password from the user object
          user.password = undefined;
          res.send({
            success: true,
            data: user,
            message: "User fetched successfully"
          });
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          res.send({
            success: false,
            message: _context3.t0.message
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // after click on the email link 
// Email verification endpoint
//bdelt lkhota balsst ma nbrek 3la link w ndoz 3la server 3ad nmchy l react page dyal verifie mchit direct 
// router.get("/users/:id/verify/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user) {
//       return res.send({ success: false, message: "Invalid user" });
//     }
//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) {
//       return res.send({ success: false, message: "Invalid token" });
//     }
//     // bedlt isVerified b verified
//     user.verified = true;
//     await user.save();
//     await token.remove();
// res.redirect(`${process.env.FRONTEND_URL}/verified`);
//     console.log("Email verified successfully");
//   } catch (error) {
//     res.send({ success: false, message: error.message });
//   }
// });
// router.get("/users/:id/verify/:token", async (req, res) => {
//   try {
//     console.log("Verification endpoint hit");  // Debugging line
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user) {
//       console.log("Invalid user");  // Debugging line
//       return res.send({ success: false, message: "Invalid user" });
//     }
//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) {
//       console.log("Invalid token");  // Debugging line
//       return res.send({ success: false, message: "Invalid token" });
//     }
//     user.verified = true;
//     await user.save();
//     await token.remove();
//     console.log("Email verified successfully");  // Debugging line
//     res.redirect(`${process.env.FRONTEND_URL}/verified`);
//   } catch (error) {
//     console.log("Error: ", error.message);  // Debugging line
//     res.send({ success: false, message: error.message });
//   }
// });
// fakeUser

router.post("/login/new", function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            res.send({
              success: false,
              message: "Please confirm your email address"
            });
          } catch (error) {
            res.send({
              success: false,
              message: "Please confirm your email address"
            });
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Delete user account : this codes just remove the user the codes in bellow remove him and remove him from all projects 
// router.delete("/delete-account", authMiddleware, async (req, res) => {
//   try {
//     ////////
//     const token = req.cookies.jwt;
//     const decoded = jwt.verify(token, process.env.jwt_secret);
//     // console.log(decoded.userId);
//     /////////
//     // Delete user account
//     await User.findByIdAndDelete(decoded.userId);
//     // await User.findByIdAndDelete(req.user.id);
//     res.send({
//       success: true,
//       message: "Account deleted successfully",
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// my codes to remove user and remove him from all project 

var Project = require("../models/projectModel");

var Task = require("../models/taskModel");

router["delete"]("/delete-account", authMiddleware, function _callee5(req, res) {
  var token, decoded, resul;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.jwt_secret); // // Find all projects where the user is a member
          // const projectsToUpdate = await Project.find({ "members.user": decoded.userId });
          // // Update each project to remove the user from the members array
          // await Promise.all(projectsToUpdate.map(async (project) => {
          //   project.members = project.members.filter(member => member.user != decoded.userId);
          //   await project.save();
          // }));
          // // Delete tasks assigned to the user
          // await Task.deleteMany({ assignedTo: decoded.userId });
          // // Delete user account
          // await User.findByIdAndDelete(decoded.userId);
          // *************************************************************************************
          // lcodat mn hna l te7t dyl disable account w li fo9 nejmat dyal delete account li kano 3andi deja
          //  update isDisable string in dataBase

          _context5.next = 5;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: decoded.userId
          }, {
            isDesable: "true",
            deactivatedAt: new Date()
          }));

        case 5:
          resul = _context5.sent;
          // so i faced problem of the user after disable his accout come back again to home page so 
          // im gonna remove jwt token to end season wndmn bli ghay5roj 
          // remove jwt
          res.cookie("jwt", "", {
            maxAge: 1
          });
          res.send({
            success: true,
            message: "Account desactivated successfully"
          });
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          res.send({
            success: false,
            message: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
});

var cron = require('node-cron');

cron.schedule('0 0 * * *', function _callee8() {
  var ninetyDaysAgo, usersToDelete;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
          // Find users who were deactivated more than 90 days ago

          _context8.next = 4;
          return regeneratorRuntime.awrap(User.find({
            isDesable: true,
            deactivatedAt: {
              $lte: ninetyDaysAgo
            }
          }));

        case 4:
          usersToDelete = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(Promise.all(usersToDelete.map(function _callee7(user) {
            var projectsToUpdate;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(Project.find({
                      "members.user": user._id
                    }));

                  case 2:
                    projectsToUpdate = _context7.sent;
                    _context7.next = 5;
                    return regeneratorRuntime.awrap(Promise.all(projectsToUpdate.map(function _callee6(project) {
                      var index;
                      return regeneratorRuntime.async(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              index = project.members.findIndex(function (member) {
                                return member.user.toString() === user._id.toString();
                              });

                              if (!(index !== -1)) {
                                _context6.next = 5;
                                break;
                              }

                              project.members.splice(index, 1);
                              _context6.next = 5;
                              return regeneratorRuntime.awrap(project.save());

                            case 5:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      });
                    })));

                  case 5:
                    _context7.next = 7;
                    return regeneratorRuntime.awrap(Task.deleteMany({
                      assignedTo: user._id
                    }));

                  case 7:
                    _context7.next = 9;
                    return regeneratorRuntime.awrap(User.findByIdAndDelete(user._id));

                  case 9:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 7:
          console.log('Inactive accounts cleanup job ran successfully');
          _context8.next = 13;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error('Error running inactive accounts cleanup job:', _context8.t0);

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;