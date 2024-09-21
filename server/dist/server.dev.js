"use strict";

var express = require("express");

var app = express();

require("dotenv").config();

app.use(express.json());

var dbConfig = require("./config/dbConfig");

var port = process.env.PORT || 5000; //  hna bdir chnagement f .json

var dashboardRoute = require('./routes/dashboard');

var usersRoute = require("./routes/usersRoute");

var projectsRoute = require("./routes/projectsRoute");

var tasksRoute = require("./routes/tasksRoute");

var notificationsRoute = require("./routes/notificationsRoute"); // send email


app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs'); // hado lcodat li sel7o lmochkila 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname); // profile 

var multer = require('multer');

var upload = multer({
  storage: multer.diskStorage({})
});

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dsxr4aije',
  api_key: '872272649426164',
  api_secret: 'ChUp_VobNdoa3OH_q5lfm2WhI0g'
});

var User = require("./models/userModel");

var jwt = require("jsonwebtoken"); // chatgbt


var cookieParser = require('cookie-parser');

app.use(cookieParser()); // middlware to access to the user email from users file (verfiaction email in registration) *********
// had lcode hada houa li jebt bih lemail mn ba3d ma saredto mn usersRoute, arh tema katebha 3lih

app.use(function (req, res, next) {
  req.userEmail = req.app.get('userEmail');
  next();
}); // *******************************************************************************************************

app.use('/api/dashboard', dashboardRoute);
app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/notifications", notificationsRoute); // clear jwt 

app.post('/clear-token', function _callee(req, res) {
  var token, decoded, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.userId
          }));

        case 4:
          user = _context.sent;
          user.online = false;
          _context.next = 8;
          return regeneratorRuntime.awrap(user.save());

        case 8:
          res.cookie("jwt", "", {
            maxAge: 1
          });
          res.status(200).send({
            success: true,
            message: "Token cleared"
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}); // forgot password - get request 

app.get('/forgot-password', function (req, res) {
  res.render("./views/forgot.ejs");
}); // deployment config

var path = require("path");

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express["static"](path.join(__dirname, "/client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} // page of the verification after hit the link in email in registration


app.get('/users/665a6ba3ac2c3f4d4a4d49f8/verify/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53', function _callee2(req, res) {
  var resul;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res.redirect("".concat(process.env.FRONTEND_URL, "/verified")); // الحمدلله قدرت نجيب الايمايل 
          // 9dert nhssal 3lih mn dak lmiddleware li lfoo9 

          console.log('Email from usersRoute:', req.userEmail); // db mn ba3d ma 7sselt 3la lemail b9ali nmchy w nbedl dak verified mn false l true b update one 

          _context2.next = 4;
          return regeneratorRuntime.awrap(User.updateOne({
            email: req.userEmail
          }, {
            verified: "true"
          }));

        case 4:
          resul = _context2.sent;

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // image profile

app.post('/update-profile', upload.single('avatar'), function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log("hiiiiiiii");
  console.log(req.file);
  cloudinary.uploader.upload(req.file.path, function _callee3(error, result) {
    var token, decoded, avatar;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("==================================+++==");

            if (!result) {
              _context3.next = 10;
              break;
            }

            console.log(result.secure_url);
            token = req.cookies.jwt;
            decoded = jwt.verify(token, process.env.jwt_secret); // console.log(decoded.userId);

            _context3.next = 7;
            return regeneratorRuntime.awrap(User.updateOne({
              _id: decoded.userId
            }, {
              profileImage: result.secure_url
            }));

          case 7:
            avatar = _context3.sent;
            console.log(avatar);
            res.redirect("/forgot-password");

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
}); // **************************************************** contact form 

var nodemailer = require('nodemailer'); // Create Nodemailer Transporter


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
}); // send email >> contact

var sendWelcomeEmail = function sendWelcomeEmail(userEmail, userMessage) {
  var mailOptions = {
    from: userEmail,
    to: process.env.EMAIL_USER,
    subject: 'Welcome to ProjectEvo Service',
    text: userMessage
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

app.post("/send-email", function _callee4(req, res) {
  var userEmail, userMessage;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userEmail = req.body.email;
          userMessage = req.body.message;
          sendWelcomeEmail(userEmail, userMessage); // zedt hada f design*******************************

          res.redirect("".concat(process.env.FRONTEND_URL, "/login")); // ***************************************************

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // ******************************************************************
// *************************************************************************** forgot password

var x;
app.post("/forgot-password", function _callee5(req, res) {
  var userEmail, user, sendWelcomeEmail;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userEmail = req.body.email;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: userEmail
          }));

        case 3:
          user = _context5.sent;
          x = user;

          sendWelcomeEmail = function sendWelcomeEmail(userEmail) {
            var mailOptions = {
              from: process.env.EMAIL_USER,
              to: userEmail,
              subject: 'Welcome to ProjectEvo Service',
              text: "We have received a request to reset your password. Please click on the link below to proceed with resetting your password:  ".concat(process.env.BASE_URL, "users/665a6ba3ac2c3f4d4a4d49f8/reset-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53")
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error sending email: ', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          };

          sendWelcomeEmail(userEmail); // hada zedto f design 

          res.redirect("".concat(process.env.FRONTEND_URL, "/login"));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // seconde endpoint : 
// to search on user by his email

app.get("/users/665a6ba3ac2c3f4d4a4d49f8/reset-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // console.log(x);
          // db 5essni ndirlih redirectl page li ghadi ymchi liha bch ybedl lpassowrd dyalo 
          // donc first ghadi nsawebha 
          res.redirect("".concat(process.env.FRONTEND_URL, "/resetPassword"));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // third end point verifie password in the two inputs and update password using id or email
// ghadi njibhom 3an tariq lvariable li redito global w fih lobject dyal luser li da5al lemail dyalo 
// bch ybedl lpassword donc nqdar n7ssel mno 3la id w lpasswd 
// donc ghadi n5adem ya id dyalo ya email bch nupdate lih lpassword faqat 

var bcrypt = require("bcryptjs");

app.post("/newpassword", function _callee7(req, res) {
  var currentEmail, salt, hashedPassword, result;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!(req.body.password === req.body.confirmPassword)) {
            _context7.next = 12;
            break;
          }

          currentEmail = x.email; //had x fiha objt dyal user li baghi ybedl passwd dyalo
          // b nessba l anani nt2aked mn ana lpasswords bjoj metabqin hadi kayna f antd pardefault الحمدلله
          // jebna data dyalo mn data base mn jidid kola 
          // const currentUser = await User.findOne({ email: currentEmail })
          // hash password

          _context7.next = 4;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 4:
          salt = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.confirmPassword, salt));

        case 7:
          hashedPassword = _context7.sent;
          _context7.next = 10;
          return regeneratorRuntime.awrap(User.updateOne({
            email: currentEmail
          }, {
            password: hashedPassword
          }));

        case 10:
          result = _context7.sent;
          // lqit bli bch ywqa3li redirect w ytla3li dak lmessage bli password changed succesfully 5essni 
          // 5essni ndir redirect hna w lfront-end b navigate b joj 
          res.redirect("http://localhost:3000/login");

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // ***************************************************************************
///////////////////////////////////////////  send link to email for delete account after hit okay in form 

app.post("/del-password", function _callee8(req, res) {
  var token, decoded, user, sendWelcomeEmail;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("ha houa nghezha"); // now we gonna get the user email to send him a message 

          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.jwt_secret);
          _context8.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.userId
          }));

        case 5:
          user = _context8.sent;

          // console.log(user.email);
          sendWelcomeEmail = function sendWelcomeEmail(userEmail) {
            var mailOptions = {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: 'Welcome to ProjectEvo Service',
              text: "We have received a request to deactivate your account. Please click on the link below to confirm and complete the deactivation process:  ".concat(process.env.BASE_URL, "users/665a6ba3ac2c3f4d4a4d49f8/delete-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53")
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error sending email: ', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          };

          sendWelcomeEmail(user.email);

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
}); ///////////////////////////////////////////////////////////////////////////////////////////////////////// 
// ///////////////// this is the seconde end point when the user click on link to delete account 

app.get("/users/665a6ba3ac2c3f4d4a4d49f8/delete-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          // console.log(x);
          // db 5essni ndirlih redirectl page li ghadi ymchi liha bch ybedl lpassowrd dyalo 
          // donc first ghadi nsawebha 
          res.redirect("".concat(process.env.FRONTEND_URL, "/deleteAccount"));

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}); // ************************************************************ this end point to reactivate account 

var DeactivateEmail;
app.post("/raactivate-account", function _callee10(req, res) {
  var sendWelcomeEmail;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("it poke reactivate account end point");
          console.log(req.body.email);
          DeactivateEmail = req.body.email;

          sendWelcomeEmail = function sendWelcomeEmail(userEmail) {
            var mailOptions = {
              from: process.env.EMAIL_USER,
              to: req.body.email,
              subject: 'Welcome to ProjectEvo Service',
              text: "We have received a request to reactivate your account. Please click on the link below to confirm and complete the reactivation process:  ".concat(process.env.BASE_URL, "users/665a6ba3ac2c3f4d4a4d49f8/reactivate-account/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53")
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error sending email: ', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          };

          sendWelcomeEmail(req.body.email);
          res.redirect("".concat(process.env.FRONTEND_URL, "/login"));

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
}); // **************************************************************************************
// ///////////////// this is the seconde end point when the user click on link to reactivate his account 

app.get("/users/665a6ba3ac2c3f4d4a4d49f8/reactivate-account/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log("ha houa brek f link"); // db 5essni ndirlih redirect
          // donc first ghadi nsawebha 

          res.redirect("".concat(process.env.FRONTEND_URL, "/ConfirmActivate"));

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
}); // /////////////////////////////////////////////////////////////////////////////////////////////////////
// ****************************************** third and last endpoint to reactivate an account 

app.post("/last-raactivate-account", function _callee12(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(User.updateOne({
            email: DeactivateEmail
          }, {
            isDesable: "false"
          }));

        case 2:
          result = _context12.sent;
          console.log("sf rani redito daba activate account ");
          res.redirect("".concat(process.env.FRONTEND_URL, "/login"));

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
}); // *******************************************************************************************
// ******************************************************************* chnage password in profile 

app.post("/ChangePassword", function _callee13(req, res) {
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          console.log("ha houa brek f change password li f lprofile ");
          res.redirect("".concat(process.env.FRONTEND_URL, "/internChangePassword"));

        case 2:
        case "end":
          return _context13.stop();
      }
    }
  });
}); // *******************************************************************
// ********************************************************* end point tanya dyal chnage password in profile 

app.post("/ChangePasswordTwo", function _callee14(req, res) {
  var token, decoded, user, passwordCorrect, salt, hashedPassword, result;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          // check if axios doing post request and data sent from front-end to th backedn 
          console.log("ha houa brek f last change password end point ");
          console.log(req.body.currentPassword);
          console.log(req.body.confirmPassword); // compare theCurrentPassword with the Password in dataBase

          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.jwt_secret);
          _context14.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.userId
          }));

        case 7:
          user = _context14.sent;
          _context14.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.currentPassword, user.password));

        case 10:
          passwordCorrect = _context14.sent;

          if (passwordCorrect) {
            _context14.next = 13;
            break;
          }

          return _context14.abrupt("return", res.send({
            success: false,
            message: "Current password is incorrect"
          }));

        case 13:
          _context14.next = 15;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 15:
          salt = _context14.sent;
          _context14.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.confirmPassword, salt));

        case 18:
          hashedPassword = _context14.sent;
          _context14.next = 21;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: decoded.userId
          }, {
            password: hashedPassword
          }));

        case 21:
          result = _context14.sent;
          res.send({
            success: true,
            message: ""
          });

        case 23:
        case "end":
          return _context14.stop();
      }
    }
  });
}); // *******************************************************************
// ********************************************** chnage first name 

app.post("/ChangeName", function _callee15(req, res) {
  var token, decoded, _user;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          console.log("Request received at /ChangeName endpoint");
          console.log("First Name:", req.body.firstName);
          console.log("Last Name:", req.body.lastName);
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context15.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.userId
          }));

        case 8:
          _user = _context15.sent;
          _user.firstName = req.body.firstName;
          _user.lastName = req.body.lastName;
          _context15.next = 13;
          return regeneratorRuntime.awrap(_user.save());

        case 13:
          res.send({
            success: true,
            message: "Name changed successfully"
          });
          _context15.next = 20;
          break;

        case 16:
          _context15.prev = 16;
          _context15.t0 = _context15["catch"](0);
          console.error("Error changing name:", _context15.t0);
          res.status(500).send({
            success: false,
            message: "An error occurred while changing the name"
          });

        case 20:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // ****************************************************************

app.listen(port, function () {
  return console.log("Node JS server listening on port ".concat(port));
}); //  before add anything about nitification