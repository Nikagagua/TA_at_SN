import React, { useEffect, useState } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const GLOBAL_SIGN_IN_COUNT_QUERY = gql`
  query globalSignInCount {
    globalSignInCount
  }
`;

const SIGN_IN_COUNT_SUBSCRIPTION = gql`
  subscription {
    signInCountUpdated
  }
`;

const Dashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { data: globalData, refetch: refetchGlobal } = useQuery(
    GLOBAL_SIGN_IN_COUNT_QUERY,
  );

  const [globalSignInCount, setGlobalSignInCount] = useState(0);

  useSubscription(SIGN_IN_COUNT_SUBSCRIPTION, {
    onData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        setGlobalSignInCount(subscriptionData.data.signInCountUpdated);
        refetchGlobal();
      }
    },
  });

  useEffect(() => {
    if (globalData) {
      setGlobalSignInCount(globalData.globalSignInCount);
    }
  }, [globalData]);

  useEffect(() => {
    if (globalSignInCount >= 5) {
      alert("Global sign-in count has reached 5!");
    }
  }, [globalSignInCount]);

  useEffect(() => {
    if (!user) {
      console.log("Not authenticated, redirecting to login...");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 0);
    }
  }, [user, logout, navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Your sign-in count: {user.signInCount}</p>
      <p>Global sign-in count: {globalSignInCount}</p>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
