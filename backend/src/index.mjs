import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { typeDefs } from "./schema.mjs";
import { resolvers } from "./resolvers.mjs";
import { sequelize } from "./models.mjs";
import { getUserFromToken } from "./auth.mjs";

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

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: () => {
        console.log("Connected to websocket");
      },
      onDisconnect: () => {
        console.log("Disconnected from websocket");
      },
    },
    {
      server: httpServer,
      path: "/graphql",
    },
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, async () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`,
    );
    try {
      await sequelize.authenticate();
      console.log("Database connected...");
      await sequelize.sync({ force: false });
      console.log("Database synchronized...");
    } catch (error) {
      console.error("Failed to sync database:", error);
    }
  });
}

startServer();
