import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

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
  const [register, { error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { username, password } });
      localStorage.setItem("token", data.register.token);
      navigate("/dashboard");
    } catch (e) {
      console.error("Error during registration:", e);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>Error registering: {error.message}</p>}
    </div>
  );
};

export default Register;
