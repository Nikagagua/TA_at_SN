import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Home Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the home page!
      </Typography>
      <Box mt={4}>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            fullWidth
          >
            Login
          </Button>
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/register"
            fullWidth
          >
            Register
          </Button>
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard"
            fullWidth
          >
            Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
