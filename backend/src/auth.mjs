import jwt from "jsonwebtoken";
import { User } from "./models.mjs";

export const createToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

export const getUserFromToken = async (token) => {
  if (!token) return null;
  try {
    console.log("Token received for verification:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    return await User.findByPk(decoded.id);
  } catch (err) {
    console.error("Failed to authenticate token:", err);
    return null;
  }
};
