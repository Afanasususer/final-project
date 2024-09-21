const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;
//  hna bdir chnagement f .json




const dashboardRoute = require('./routes/dashboard');
const usersRoute = require("./routes/usersRoute");
const projectsRoute = require("./routes/projectsRoute");
const tasksRoute = require("./routes/tasksRoute");
const notificationsRoute = require("./routes/notificationsRoute");

// send email
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
// hado lcodat li sel7o lmochkila 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

// profile 
const multer = require('multer');
const upload = multer({storage: multer.diskStorage({})});
const cloudinary = require('cloudinary').v2

          
cloudinary.config({ 
  cloud_name: 'dsxr4aije', 
  api_key: '872272649426164', 
  api_secret: 'ChUp_VobNdoa3OH_q5lfm2WhI0g' 
});
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");

// chatgbt
const cookieParser = require('cookie-parser');
app.use(cookieParser());




// middlware to access to the user email from users file (verfiaction email in registration) *********
// had lcode hada houa li jebt bih lemail mn ba3d ma saredto mn usersRoute, arh tema katebha 3lih
app.use((req, res, next) => {
  req.userEmail = req.app.get('userEmail');
  next();
});
// *******************************************************************************************************




app.use('/api/dashboard', dashboardRoute);
app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/notifications", notificationsRoute);


// clear jwt 
app.post('/clear-token', async (req, res) => {
  const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });
    user.online = false;
    await user.save();

  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send({ success: true, message: "Token cleared" });


});



// forgot password - get request 
app.get('/forgot-password', (req, res) => {
  res.render("./views/forgot.ejs");
});


// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


// page of the verification after hit the link in email in registration
app.get('/users/665a6ba3ac2c3f4d4a4d49f8/verify/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53', async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/verified`);
  
// الحمدلله قدرت نجيب الايمايل 
// 9dert nhssal 3lih mn dak lmiddleware li lfoo9 
  console.log('Email from usersRoute:', req.userEmail);

// db mn ba3d ma 7sselt 3la lemail b9ali nmchy w nbedl dak verified mn false l true b update one 
const resul = await User.updateOne(
        { email: req.userEmail },
        {  verified: "true" }
      )
//  5edmat liya mzyan  الحمدلله

});


// image profile
app.post('/update-profile', upload.single('avatar'), function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log("hiiiiiiii");
  console.log(req.file);



  cloudinary.uploader.upload(req.file.path, async (error, result)=>{
    console.log("==================================+++==");
    if(result){
      console.log(result.secure_url);


      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.jwt_secret);
      // console.log(decoded.userId);
      const avatar = await User.updateOne({_id: decoded.userId}, {profileImage: result.secure_url})
      console.log(avatar);
      res.redirect("/forgot-password")
    }
    

  });
})







// **************************************************** contact form 

const nodemailer = require('nodemailer');   
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
// send email >> contact
const sendWelcomeEmail = (userEmail, userMessage) => {
  const mailOptions = {
    from: userEmail,
    to: process.env.EMAIL_USER,
    subject: 'Welcome to ProjectEvo Service',
    text: userMessage
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


app.post("/send-email", async (req, res) => {
  const userEmail = req.body.email 
  const userMessage = req.body.message 
  sendWelcomeEmail(userEmail, userMessage);
  // zedt hada f design*******************************
  res.redirect(`${process.env.FRONTEND_URL}/login`);
// ***************************************************
});
// ******************************************************************



























// *************************************************************************** forgot password


let x
app.post("/forgot-password", async (req, res) => {
  
  const userEmail = req.body.email 

  const user = await User.findOne({ email: userEmail })
    x = user 

  
  const sendWelcomeEmail = (userEmail) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to ProjectEvo Service',
      text: `We have received a request to reset your password. Please click on the link below to proceed with resetting your password:  ${process.env.BASE_URL}users/665a6ba3ac2c3f4d4a4d49f8/reset-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  };


  sendWelcomeEmail(userEmail);

  // hada zedto f design 
  res.redirect(`${process.env.FRONTEND_URL}/login`);
});




// seconde endpoint : 
// to search on user by his email

app.get("/users/665a6ba3ac2c3f4d4a4d49f8/reset-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", async (req, res) => {
  // console.log(x);
  // db 5essni ndirlih redirectl page li ghadi ymchi liha bch ybedl lpassowrd dyalo 
  // donc first ghadi nsawebha 
  res.redirect(`${process.env.FRONTEND_URL}/resetPassword`);

});




// third end point verifie password in the two inputs and update password using id or email

// ghadi njibhom 3an tariq lvariable li redito global w fih lobject dyal luser li da5al lemail dyalo 
// bch ybedl lpassword donc nqdar n7ssel mno 3la id w lpasswd 
// donc ghadi n5adem ya id dyalo ya email bch nupdate lih lpassword faqat 


const bcrypt = require("bcryptjs");

app.post("/newpassword", async (req, res) => {
  // t2aked ila kan lpassword equals or no 
  if (req.body.password === req.body.confirmPassword){
    const currentEmail = x.email    //had x fiha objt dyal user li baghi ybedl passwd dyalo

    // b nessba l anani nt2aked mn ana lpasswords bjoj metabqin hadi kayna f antd pardefault الحمدلله

    // jebna data dyalo mn data base mn jidid kola 
    // const currentUser = await User.findOne({ email: currentEmail })

    // hash password
    const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.confirmPassword, salt);

      // update user password with new one in database
      const result = await User.updateOne(
        { email: currentEmail },
        {  password: hashedPassword }
      )
  
    // lqit bli bch ywqa3li redirect w ytla3li dak lmessage bli password changed succesfully 5essni 
    // 5essni ndir redirect hna w lfront-end b navigate b joj 
    res.redirect("http://localhost:3000/login")

  }

});




// ***************************************************************************














///////////////////////////////////////////  send link to email for delete account after hit okay in form 


app.post("/del-password", async (req, res) => {
      console.log("ha houa nghezha");
  // now we gonna get the user email to send him a message 
      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.jwt_secret);
      const user = await User.findOne({ _id: decoded.userId })
      // console.log(user.email);


  const sendWelcomeEmail = (userEmail) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to ProjectEvo Service',
      text: `We have received a request to deactivate your account. Please click on the link below to confirm and complete the deactivation process:  ${process.env.BASE_URL}users/665a6ba3ac2c3f4d4a4d49f8/delete-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  };


  sendWelcomeEmail(user.email);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////// 


// ///////////////// this is the seconde end point when the user click on link to delete account 
app.get("/users/665a6ba3ac2c3f4d4a4d49f8/delete-password/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", async (req, res) => {
  // console.log(x);
  // db 5essni ndirlih redirectl page li ghadi ymchi liha bch ybedl lpassowrd dyalo 
  // donc first ghadi nsawebha 
  res.redirect(`${process.env.FRONTEND_URL}/deleteAccount`);

});












// ************************************************************ this end point to reactivate account 


let DeactivateEmail
app.post("/raactivate-account", async (req, res) => {
  console.log("it poke reactivate account end point");
  console.log(req.body.email);
  DeactivateEmail = req.body.email


const sendWelcomeEmail = (userEmail) => {
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: req.body.email,
  subject: 'Welcome to ProjectEvo Service',
  text: `We have received a request to reactivate your account. Please click on the link below to confirm and complete the reactivation process:  ${process.env.BASE_URL}users/665a6ba3ac2c3f4d4a4d49f8/reactivate-account/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email: ', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

};


sendWelcomeEmail(req.body.email);
res.redirect(`${process.env.FRONTEND_URL}/login`);

});

// **************************************************************************************

// ///////////////// this is the seconde end point when the user click on link to reactivate his account 

app.get("/users/665a6ba3ac2c3f4d4a4d49f8/reactivate-account/6e779792c0c125b8c6695039097702a86c4dc572c88f3fb2772086a3958b2f53", async (req, res) => {
  console.log("ha houa brek f link");
  // db 5essni ndirlih redirect
  // donc first ghadi nsawebha 
  res.redirect(`${process.env.FRONTEND_URL}/ConfirmActivate`);

});

// /////////////////////////////////////////////////////////////////////////////////////////////////////




// ****************************************** third and last endpoint to reactivate an account 

app.post("/last-raactivate-account", async (req, res) => {
  // console.log("ha houa nghez akher end point f reactivate ");
  // console.log(DeactivateEmail);

  // now i have to update isDesable
  const result = await User.updateOne(
    { email: DeactivateEmail },
    {  isDesable: "false" }
  )
console.log("sf rani redito daba activate account ");
res.redirect(`${process.env.FRONTEND_URL}/login`);
});


// *******************************************************************************************












// ******************************************************************* chnage password in profile 


app.post("/ChangePassword", async (req, res) => {
  console.log("ha houa brek f change password li f lprofile ");
  
 res.redirect(`${process.env.FRONTEND_URL}/internChangePassword`);
});



// *******************************************************************








// ********************************************************* end point tanya dyal chnage password in profile 


app.post("/ChangePasswordTwo", async (req, res) => {

  // check if axios doing post request and data sent from front-end to th backedn 
  console.log("ha houa brek f last change password end point ");
  console.log(req.body.currentPassword);
  console.log(req.body.confirmPassword);

  // compare theCurrentPassword with the Password in dataBase
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.jwt_secret);
  const user = await User.findOne({ _id: decoded.userId })

  // check if the password is correct
  const passwordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!passwordCorrect) {
    return res.send({
      success: false,
        message: "Current password is incorrect",
    });
  }



  // now we gonna hash password && update user Password with the newOne
      // hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.confirmPassword, salt);

      // update user password with new one in database
const result = await User.updateOne(
  { _id: decoded.userId },
  {  password: hashedPassword }
)






  
res.send({
  success: true,
    message: "",
});
});



// *******************************************************************













// ********************************************** chnage first name 
app.post("/ChangeName", async (req, res) => {
  try {
    console.log("Request received at /ChangeName endpoint");
    console.log("First Name:", req.body.firstName);
    console.log("Last Name:", req.body.lastName);

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    await user.save();

    res.send({
      success: true,
      message: "Name changed successfully",
    });
  } catch (error) {
    console.error("Error changing name:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while changing the name",
    });
  }
});




// ****************************************************************










app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
//  before add anything about nitification