import jwt from "jsonwebtoken";
import { User } from "./models.mjs";

export const createToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, "your-secret-key", {
    expiresIn: "1d",
  });
};

export const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    return await User.findByPk(decoded.id);
  } catch (err) {
    return null;
  }
};
