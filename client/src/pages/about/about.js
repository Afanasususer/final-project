import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../../apicalls/users";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import { Facebook, Instagram, Twitter, GitHub, LinkedIn } from '@mui/icons-material';

import { ArrowRight } from '@mui/icons-material';
import { Helmet } from "react-helmet-async";


const AboutWork = () => {
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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
        <Card sx={{ display: 'flex', maxWidth: '900px', width: '100%', boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', md: 350 }, height: 'auto' }}
            image="Sandy_Bus-05_Single-10.jpg"
            alt="Woman working on laptop"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent sx={{ flex: '1 0 auto', p: 4 }}>
              <Typography component="div" variant="h5" color="primary" gutterBottom sx={{fontWeight: 700}}>
                About Projectevo
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Projectevo is your go-to solution for efficient task and project management. Whether you're an individual managing personal tasks or a team collaborating on complex projects, Projectevo provides the tools you need to organize, prioritize, and track your work with ease.
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph fontWeight="fontWeightBold">
                With Projectevo, you can create tasks, assign them to team members, set deadlines, and monitor progress in real-time. Say goodbye to scattered to-do lists and messy email threads – Projectevo centralizes all your tasks and communications in one intuitive platform.
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Designed with simplicity and productivity in mind, Projectevo streamlines your workflow, helping you stay focused on what matters most. From simple task lists to complex project timelines, Projectevo adapts to your needs, empowering you to achieve your goals efficiently.
              </Typography>
              <Button
                onClick={() => navigate("/register")}
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                startIcon={<ArrowRight />}
              >
              Join Us
              </Button>


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
            <Typography variant="body2" color="textSecondary" align="left" sx={{mb:1, mt:2}}>
                    © 2024 ProjectEvo. All Rights Reserved.​
                  </Typography>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default AboutWork;

// lcode lassli 
//  done .. .. .. .. alhamdullilah .. .. .. 