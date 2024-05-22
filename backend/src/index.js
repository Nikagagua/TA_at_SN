require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const cors = require("cors");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");
const { sequelize } = require("./models");
const { getUserFromToken } = require("./auth");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

async function startServer() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = await getUserFromToken(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);

  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
      onConnect: (connectionParams, webSocket, context) => {
        console.log("Connected to websocket");
      },
      onDisconnect: (webSocket, context) => {
        console.log("Disconnected from websocket");
      },
    },
    {
      server: httpServer,
      path: "/graphql",
    },
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

startServer();
