import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const { login: loginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      loginUser(data.login.token);
      navigate("/dashboard");
    } catch (error) {
      setError(
        "Invalid credentials. Please register if you don't have an account.",
      );
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
          Login
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
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        {error && (
          <Alert severity="error" style={{ marginTop: 20 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" style={{ marginTop: 20 }}>
          Don't have an account? <Link href="/register">Register here</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
