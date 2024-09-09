import "./CoverPage.css";
import { Link } from "react-router-dom";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../../apicalls/users";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import {
  Facebook,
  Instagram,
  Twitter,
  GitHub,
  LinkedIn,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

const CoverPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await GetLoggedInUser();
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Helmet>
        <title>ProjectEvo</title>
      </Helmet>
      <div className="cover-container">
        <video className="video-background" autoPlay loop muted>
          <source
            src="vecteezy_uma-homem-e-trabalhando-em-dele-computador-portatil-com-uma_41449224.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <header className="header">
          <div className="inner">
            <div className="left-side">
              <img
                src="3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png"
                alt="ProjectEvo Logo"
                className="logo"
              />
              <h1 className="masthead-brand">
                <Link to="/coverpage">ProjectEvo</Link>
              </h1>
            </div>
            <nav className="nav-masthead">
              <Link
                style={{ color: "white" }}
                className="nav-link"
                aria-current="page"
                to="/login"
              >
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
              <Link className="nav-link" to="/about">
                About
              </Link>
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
              <span className="email">{user?.email}</span>
            </nav>
          </div>
        </header>

        <main className="main">
          <div className="main-content">
            <h1 className="bigTitle">
              Welcome {user?.firstName} to ProjectEvo
            </h1>
            <div id="guest" className={!user ? "show" : "hide"}>
              <p className="lead leading-6">
                Effortlessly manage your tasks and projects with ProjectEvo.
                Enhance your workflow, collaborate seamlessly with your team,
                and stay organized effortlessly.
              </p>
              <p className="lead">
                <Link to="/register" className="btn btn-lg btn-primary">
                  Get Started Now <ArrowRightOutlined className="icon" />
                </Link>
              </p>
            </div>
            <div id="user" className={user ? "show" : "hide"}>
              <p className="lead leading-6">
                Welcome back to ProjectEvo! Manage your tasks effortlessly,
                collaborate seamlessly with your team, and stay on top of your
                projects. Let's get things done!
              </p>
              <p className="lead">
                <Link to="/" className="btn btn-lg btn-primary">
                  BACK TO HOME PAGE
                  <ArrowRightOutlined className="icon" />
                </Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="footer">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3,
            }}
          >
            {/* <IconButton
              component="a"
              href="https://www.facebook.com/your-facebook-profile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#1877f2',
                fontSize: '32px',
                '&:hover': {
                  color: '#fff',
                  transform: 'scale(1.1)',
                },
                mr: 2,
                transition: 'transform 0.3s ease',
              }}
            >
              <Facebook fontSize="inherit" />
            </IconButton> */}

            <IconButton
              component="a"
              href="https://github.com/settings/profile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#333",
                fontSize: "32px",
                "&:hover": {
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                mr: 2,
                transition: "transform 0.3s ease",
              }}
            >
              <GitHub fontSize="inherit" />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.instagram.com/projectevo09/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#e4405f",
                fontSize: "32px",
                "&:hover": {
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                mr: 2,
                transition: "transform 0.3s ease",
              }}
            >
              <Instagram fontSize="inherit" />
            </IconButton>
            <IconButton
              component="a"
              href="https://x.com/ProjectEvo64808"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#1da1f2",
                fontSize: "32px",
                "&:hover": {
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                mr: 2,
                transition: "transform 0.3s ease",
              }}
            >
              <Twitter fontSize="inherit" />
            </IconButton>
            {/* 
            <IconButton
              component="a"
              href="https://github.com/your-github-profile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#333',
                fontSize: '32px',
                '&:hover': {
                  color: '#fff',
                  transform: 'scale(1.1)',
                },
                mr: 2,
                transition: 'transform 0.3s ease',
              }}
            >
              <GitHub fontSize="inherit" />
            </IconButton> */}

            <IconButton
              component="a"
              href="https://web.facebook.com/profile.php?id=61562134453972&is_tour_dismissed"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#1877f2",
                fontSize: "32px",
                "&:hover": {
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                mr: 2,
                transition: "transform 0.3s ease",
              }}
            >
              <Facebook fontSize="inherit" />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.linkedin.com/in/project-evo-665a45318/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#0a66c2",
                fontSize: "32px",
                "&:hover": {
                  color: "#fff",
                  transform: "scale(1.1)",
                },
                transition: "transform 0.3s ease",
              }}
            >
              <LinkedIn fontSize="inherit" />
            </IconButton>
          </Box>
          <p>ProjectEvo - Your Ultimate Project Management Solution</p>
        </footer>
      </div>
    </>
  );
};

export default CoverPage;
//  im good hna lhamdllah w had xi li ana bghito kolo kayn hta l daba lhamdllah .. .. .. 