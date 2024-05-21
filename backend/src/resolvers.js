const bcrypt = require("bcryptjs");
const { User } = require("./models");
const { createToken, getUserFromToken } = require("./auth");

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
      return { token: createToken(user), user };
    },
  },
};

module.exports = { resolvers };
