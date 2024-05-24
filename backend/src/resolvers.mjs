import { User } from "./models.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return user;
    },
    globalSignInCount: async () => {
      const users = await User.findAll();
      return users.reduce((sum, user) => sum + user.signInCount, 0);
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        return { token: createToken(user), user };
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          throw new Error(`Username "${username}" is already taken.`);
        }
        console.error("Error during registration:", error);
        throw new Error("Registration error");
      }
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      user.signInCount += 1;
      await user.save();

      return { token: createToken(user), user };
    },
  },
};

export { resolvers };
