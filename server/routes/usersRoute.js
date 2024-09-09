const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
// new
const { check, validationResult } = require("express-validator");
const nodemailer = require('nodemailer');
require('dotenv').config();
const Token = require("../models/token");
const crypto = require("crypto");
// for ejs template 
// app.set('view engine', 'ejs')






// zedthoom ghy db bch nder delete account 
const cookieParser = require('cookie-parser');




// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // replace with your email
    pass: process.env.EMAIL_PASS   // replace with your email password
  },
  tls: {
    rejectUnauthorized: true
  }
});


// Create a Function to Send the Email
const sendWelcomeEmail = (userEmail,url) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Welcome to Our Service',
    text: `Thank you for registering with our service. We are excited to have you on board!, ${url}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};








// register a new user
router.post(
  "/register",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  async (req, res) => {
    try {
  {    // check if the user enter strong password and correct email : hada 5edam wallakin ana bghit fch
      //  ykon lghalat f email ygoli email ghayr shih w fch ykon f password ygoliya passwd d3if 
      // const objError = validationResult(req);
      // if (objError.errors.length > 0) {
      //   return res.send({
      //     success: false,
      //     message: "type good",
      //   });
      //  }


       // check if the user entered a strong password and correct email : hada 5edam wallakin fch kikon
      //  5atae f password makisaredch dak lmesage l lfront-end 
    // const objError = validationResult(req);
    // console.log(objError.errors);
    // if (objError.errors.length > 0) {
    //   objError.errors.forEach(element => {
    //     if (element.path === 'email') {
    //       return res.send({
    //         success: false,
    //         message: "invalid form email",
    //       });
    //     }
      
    //      if (element.path === 'password') {
    //       return res.send({
    //         success: false, 
    //         message: "weak password",
    //       });
    //     }
    //   })
    // }
    }  

    const objError = validationResult(req);
    // console.log(objError.errors);
    if (objError.errors.length > 0) {
      for (let i = 0; i < objError.errors.length; i++) {
        let element = objError.errors[i];
        if (element.path === 'email') {
          return res.send({
            success: false,
            message: "The email address you entered is not in a valid format. Please enter a valid email address (e.g., user@example.com).",
          });
        }
        
        if (element.path === 'password') {
          return res.send({
            success: false, 
            message: "The password you entered is too weak. Please choose a password that is at least 8 characters long and includes a mix of letters, numbers, and special characters.",
          });
        }
      }
    }
    
    // hada zedto hna bch nsared l server email dyal luser *****************************************************
    req.app.set('userEmail', req.body.email);
    // *************************************************************************************

    
      // check if the user already exists
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        throw new Error("User already exists");
      }

      // check if password == confirmPassword
      if (req.body.password !== req.body.confirmPassword) {
        return res.send({
          success: false,
          message: "Passwords do not match",
        });
    }


      // hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      // save the user
      const user = new User(req.body);
      await user.save();
      

       // Send welcome email
      //  sendWelcomeEmail(req.body.email);

       const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      // const url = `${process.env.FRONTEND_URL}/verified`;
      const url = `${process.env.BASE_URL}users/665a6ba3ac2c3f4d4a4d49f8/verify/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53`;
      sendWelcomeEmail(user.email, url);



          
      res.send({
        success: true,
        message: "User registered successfully, and email has send to your account",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);







// login a user
router.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // check if the password is correct
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      throw new Error("Invalid password");
    }




   // Check if the user is verified
   if (!user.verified) {
      throw new Error("Verify your email please");
    }





   // Check if the user is Desable
   
  //  if (user.isDesable) {
  //     throw new Error("Your account has been deactivated. Please contact support for assistance.");
  //   }

  // ********************************** hada 3ad zedto 3a wed activate account 
  if (user.isDesable) {
    throw new Error("Your account has been deactivated.<a href='/'>Click here to reactivate</a>.");
  }
  // *************************************************
  






    // create and assign a token

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });



    // for online 
    user.online = true;
    await user.save();






    res.send({
      success: true,
      data: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get logged in user
router.get("/get-logged-in-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    // remove the password from the user object
    user.password = undefined;

    res.send({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});





// after click on the email link 
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
router.post("/login/new", async (req, res) => {
  try {
  

    res.send({
      success: false,
      message: "Please confirm your email address",
    });
    
  } catch (error) {
    res.send({
      success: false,
      message: "Please confirm your email address",
    });
  }
});









// Delete user account : this codes just remove the user the codes in bellow remove him and remove him from all projects 


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
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");


router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.jwt_secret);
    
    // // Find all projects where the user is a member
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
    const resul = await User.updateOne(
      { _id: decoded.userId },
      {  isDesable: "true", deactivatedAt: new Date() }
    )

    // so i faced problem of the user after disable his accout come back again to home page so 
    // im gonna remove jwt token to end season wndmn bli ghay5roj 
    // remove jwt
    res.cookie("jwt", "", { maxAge: 1 });
    

    
    res.send({
      success: true,
      message: "Account desactivated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});






const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => { // This runs at midnight every day
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

    // Find users who were deactivated more than 90 days ago
    const usersToDelete = await User.find({ isDesable: true, deactivatedAt: { $lte: ninetyDaysAgo } });

    await Promise.all(usersToDelete.map(async (user) => {
      // Remove the user from project members
      const projectsToUpdate = await Project.find({ "members.user": user._id });

      await Promise.all(projectsToUpdate.map(async (project) => {
        const index = project.members.findIndex(member => member.user.toString() === user._id.toString());
        if (index !== -1) {
          project.members.splice(index, 1);
          await project.save();
        }
      }));

      // Delete tasks assigned to the user
      await Task.deleteMany({ assignedTo: user._id });

      // Delete the user account
      await User.findByIdAndDelete(user._id);
    }));

    console.log('Inactive accounts cleanup job ran successfully');
  } catch (error) {
    console.error('Error running inactive accounts cleanup job:', error);
  }
});








module.exports = router;
