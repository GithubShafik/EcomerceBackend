const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const roleModel = require("../models/Role");
const JWT_SECRET = "hello_Boyyy";

// Register a new user
class authController {
  static register = async (req, res) => {
    const { name, email, password, dob, mobile } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const role = await roleModel.findOne({ roleName: "user" });
      if (!role) {
        return res.status(500).json({ message: "Default user role is not configured" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        dob,
        mobile,
        roleId: role._id,
      });

      await newUser.save();

      const userResponse = {
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        mobile: newUser.mobile,
        message: "User created successfully",
      };
      res.status(201).json(userResponse);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  };
  static login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const role = await roleModel.findOne({ _id: user.roleId });
      const token = jwt.sign(
        { userId: user._id, role: role.roleName },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token: token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };

  static getConfig = async (req, res) => {
    try {
      const data = {
        // user: req.user,
        UserAccess: req.UserAccess,
      };
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error });
    }
  };
}

module.exports = authController;
