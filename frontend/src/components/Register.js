import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const REGISTER_MUTATION = gql`
  mutation register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [register] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { username, password } });
      localStorage.setItem("token", data.register.token);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            fullWidth
            margin="normal"
            autoComplete="username"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        {error && (
          <Alert severity="error" style={{ marginTop: 20 }}>
            Error registering: {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Register;
