const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { FindAllAccess } = require("../models/UserAccess");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).send({ message: "Invalid Token Structure" });
    }

    const user = await User.findById(decoded.userId)
      .select("-password")
      .populate("roleId", "roleName");

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const UserAccess = await FindAllAccess({ roleID: user.roleId });

    req.user = user;
    req.UserAccess = UserAccess;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = authenticate;