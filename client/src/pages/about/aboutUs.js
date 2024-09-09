import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../../apicalls/users";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Facebook, Instagram, Twitter, GitHub, LinkedIn } from '@mui/icons-material';
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
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
        <title>About</title>
      </Helmet>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        background: 'linear-gradient(to right, #ece9e6, #ffffff)'
      }}>
        {user && (
          <Card sx={{ display: 'flex', width: '100%', height: '100%', boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ width: { xs: '100%', md: '40%' }, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ width: '100%', height: 'calc(50% - 8px)' }} // Adjusting height to fit text height
                image="aboutTanya.jpg"
                alt="Woman working on laptop"
              />
              <CardMedia
                component="img"
                sx={{ width: '100%', height: 'calc(50% - 8px)', mt: 1 }}
                image="59273.jpg"
                alt="Woman working on laptop"
              />
              {/* Add more images as needed */}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto', p: 4, mb: 4}}>
                <Typography component="div" variant="h5" color="primary" gutterBottom sx={{fontWeight: 700}}>
                  Our Story
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Projectevo is your go-to solution for efficient task and project management. Whether you're an individual managing personal tasks or a team collaborating on complex projects, Projectevo provides the tools you need to organize, prioritize, and track your work with ease.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Our mission at Projectevo is deeply ingrained in everything we do. We strive to empower individuals and businesses alike, providing them with the tools, resources, and support they need to thrive in today's rapidly evolving world.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  With Projectevo, you can create tasks, assign them to team members, set deadlines, and monitor progress in real-time. Say goodbye to scattered to-do lists and messy email threads – Projectevo centralizes all your tasks and communications in one intuitive platform.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Every day, we wake up inspired by the possibilities that lie ahead. Whether it's developing innovative solutions, fostering meaningful connections, or giving back to our communities, we're driven by a shared purpose: to create a brighter future for all.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Designed with simplicity and productivity in mind, Projectevo streamlines your workflow, helping you stay focused on what matters most. From simple task lists to complex project timelines, Projectevo adapts to your needs, empowering you to achieve your goals efficiently.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Join us on our mission and together, let's shape a world where everyone has the opportunity to thrive.
                </Typography>

                <Box sx={{ display: 'flex', mt: 3 }}>
                  <IconButton
                    component="a"
                    href="https://web.facebook.com/profile.php?id=61562134453972&is_tour_dismissed"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#1877f2',
                      background: '#e3f2fd',
                      '&:hover': {
                        background: '#1877f2',
                        color: '#fff',
                        transform: 'scale(1.1)',
                      },
                      mr: 2,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.instagram.com/projectevo09/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#e4405f',
                      background: '#fde3e3',
                      '&:hover': {
                        background: '#e4405f',
                        color: '#fff',
                        transform: 'scale(1.1)',
                      },
                      mr: 2,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://x.com/ProjectEvo64808"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#1da1f2',
                      background: '#e3f2fd',
                      '&:hover': {
                        background: '#1da1f2',
                        color: '#fff',
                        transform: 'scale(1.1)',
                      },
                      mr: 2,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://github.com/settings/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#333',
                      background: '#e0e0e0',
                      '&:hover': {
                        background: '#333',
                        color: '#fff',
                        transform: 'scale(1.1)',
                      },
                      mr: 2,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <GitHub />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.linkedin.com/in/project-evo-665a45318/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#0a66c2',
                      background: '#e3f2fd',
                      '&:hover': {
                        background: '#0a66c2',
                        color: '#fff',
                        transform: 'scale(1.1)',
                      },
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Box>

              </CardContent>
              <Typography variant="body2" color="textSecondary" align="left" sx={{mb:1}}>
                    © 2024 ProjectEvo. All Rights Reserved.​
                  </Typography>
            </Box>
          </Card>
        )}
      </Box>
    </>
  );
};

export default AboutUs;



//  done lhamdullilah .. .. .. 
//  done .. .. .. 