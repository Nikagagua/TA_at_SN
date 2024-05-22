const { PubSub } = require("graphql-subscriptions");
const bcrypt = require("bcryptjs");
const { User } = require("./models");
const { createToken, getUserFromToken } = require("./auth");

const pubsub = new PubSub();
const SIGN_IN_COUNT_UPDATED = "SIGN_IN_COUNT_UPDATED";

const resolvers = {
  Query: {
    me: async (_, __, { user }) => user,
    globalSignInCount: async () => {
      const users = await User.findAll();
      return users.reduce((sum, user) => sum + user.signInCount, 0);
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword });
      return { token: createToken(user), user };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      user.signInCount += 1;
      await user.save();
      pubsub.publish(SIGN_IN_COUNT_UPDATED, {
        signInCountUpdated: user.signInCount,
      });
      return { token: createToken(user), user };
    },
  },
  Subscription: {
    signInCountUpdated: {
      subscribe: () => pubsub.asyncIterator([SIGN_IN_COUNT_UPDATED]),
    },
  },
};

module.exports = { resolvers };
