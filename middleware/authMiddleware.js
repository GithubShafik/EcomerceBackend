const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { FindAllAccess } = require("../models/UserAccess");
const JWT_SECRET = "hello_Boyyy";

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).send({ message: "Invalid Token Structure" });
    }

    const user = await User.findById(decoded.userId).populate("roleId", "roleName");
    const UserAccess = await FindAllAccess({ roleID: user.roleId });
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    req.user = user;
    req.UserAccess = UserAccess;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Invalid Token" });
  }
};

module.exports = authenticate;
