const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { User } = require("./models");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    signInCount: Int!
  }

  type Query {
    me: User
    globalSignInCount: Int
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return context.user;
    },
    globalSignInCount: async () => {
      const users = await User.findAll();
      return users.reduce((sum, user) => sum + user.signInCount, 0);
    },
  },
};

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, "your-secret-key");
    }
    return null;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUser(token);
    return { user };
  },
});

const app = express();
app.use(cors());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(
    `Server is running on http://localhost:4000${server.graphqlPath}`,
  ),
);
