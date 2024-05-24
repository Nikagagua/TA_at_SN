import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ApolloProvider from "./ApolloProvider";
import { UserProvider } from "./components/UserContext";

const App = () => {
  return (
    <UserProvider>
      <ApolloProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </UserProvider>
  );
};

export default App;
