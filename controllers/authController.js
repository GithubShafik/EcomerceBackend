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
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      let selectedRoleId = roleID;
      if (!selectedRoleId) {
        const userRole = await roleModel.findOne({ roleName: "user" });
        if (userRole) {
          selectedRoleId = userRole._id;
        } else {
          const anyRole = await roleModel.findOne();
          selectedRoleId = anyRole?._id;
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        roleId: selectedRoleId,
      });

      await newUser.save();

      const role = await roleModel.findOne({ _id: selectedRoleId });

      const userResponse = {
        username: newUser.name,
        email: newUser.email,
        role: role?.roleName || "user",
        message: "User created successfully",
      };
      res.status(201).json(userResponse);
    } catch (error) {
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
        { userId: user._id, role: role?.roleName || "user" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token: token, user: { _id: user._id, name: user.name, email: user.email, role: role?.roleName } });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };

  static getConfig = async (req, res) => {
    try {
      const data = {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone || "",
          role: req.user.roleId?.roleName || "user",
        },
        UserAccess: req.UserAccess,
      };
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;

      await user.save();
      res.json({
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: req.user.roleId?.roleName || "user",
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current password and new password are required" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password", error: error.message });
    }
  };
}

module.exports = authController;
