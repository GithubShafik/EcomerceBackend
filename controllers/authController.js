const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const roleModel = require("../models/Role");
const JWT_SECRET = "hello_Boyyy";

// Register a new user
class authController {
  static register = async (req, res) => {
    const { name, email, password, roleID } = req.body;

    try {
      // Check if user already exists
      console.log(req.body,"req")
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

            console.log(userExists,"userExists")

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name ,
        email,
        password: hashedPassword,
        roleId: roleID,
      });

      await newUser.save();

      const role = await roleModel.findOne({ _id: roleID });

      const userResponse = {
        username: newUser.name,
        email: newUser.email,
        role: role.roleName,
        message: "User created successfully",
      };
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
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
