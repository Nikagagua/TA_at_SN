import React, { useEffect, useState } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";

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
  const { data: meData, refetch: refetchMe } = useQuery(ME_QUERY, {
    onError: (error) => console.error("Error fetching me data", error),
  });
  const { data: globalData, refetch: refetchGlobal } = useQuery(
    GLOBAL_SIGN_IN_COUNT_QUERY,
    {
      onError: (error) => console.error("Error fetching global data", error),
    },
  );

  const [globalSignInCount, setGlobalSignInCount] = useState(0);

  useSubscription(SIGN_IN_COUNT_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
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

  if (!meData || !meData.me) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {meData.me.username}</h1>
      <p>Your sign-in count: {meData.me.signInCount}</p>
      <p>Global sign-in count: {globalSignInCount}</p>
    </div>
  );
};

export default Dashboard;
