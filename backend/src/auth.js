const jwt = require("jsonwebtoken");
const { User } = require("./models");

const getUserFromToken = async (token) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      return user;
    }
    return null;
  } catch (err) {
    console.error("Error in getUserFromToken:", err);
    return null;
  }
};

module.exports = { getUserFromToken };
