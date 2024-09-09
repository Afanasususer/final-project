import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { Row, Col } from "antd";
import { styled } from "@mui/system";
// import "antd/dist/antd.css";

const ProfileContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5",
});

const ProfileSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
});

const ProfileImage = styled("img")({
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "20px",
});

function ProfilePage() {
  return (
    <ProfileContainer>
      <Row gutter={16} style={{ maxWidth: "1000px", height: "500px", width: "100%" }}>
        <Col xs={24} md={12}>
          <ProfileSection>
            <ProfileImage src="https://via.placeholder.com/150" alt="Profile" />
            <Button variant="contained" color="primary">
              Change Profile
            </Button>
          </ProfileSection>
        </Col>
        <Col xs={24} md={12}>
          <ProfileSection>
            <Box width="100%" textAlign="center" mb={2}>
              <Typography variant="h6">
                First Name: <span className="font-normal">John</span>
              </Typography>
              <Typography variant="h6">
                Last Name: <span className="font-normal">Smith</span>
              </Typography>
              <Typography variant="h6">
                Email: <span className="font-normal">john@gmail.com</span>
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
              <Button variant="outlined" color="primary">
                Change Password
              </Button>
              <Button variant="contained" color="secondary">
                Delete Account
              </Button>
            </Box>
          </ProfileSection>
        </Col>
      </Row>
    </ProfileContainer>
  );
}

export default ProfilePage;
