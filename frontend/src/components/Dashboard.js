import React, { useEffect, useState } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      signInCount
    }
  }
`;

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
  const { logout } = useUser();
  const navigate = useNavigate();
  const {
    data: meData,
    error: meError,
    refetch: refetchMe,
  } = useQuery(ME_QUERY);
  const { data: globalData, refetch: refetchGlobal } = useQuery(
    GLOBAL_SIGN_IN_COUNT_QUERY,
  );

  const [globalSignInCount, setGlobalSignInCount] = useState(0);

  useSubscription(SIGN_IN_COUNT_SUBSCRIPTION, {
    onData: () => {
      refetchMe();
      refetchGlobal();
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

  if (meError) {
    if (meError.message.includes("Not authenticated")) {
      window.location.href = "/login";
    }
    return <p>Error fetching me data: {meError.message}</p>;
  }

  if (!meData || !meData.me) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {meData.me.username}</h1>
      <p>Your sign-in count: {meData.me.signInCount}</p>
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
