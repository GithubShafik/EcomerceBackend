const roleModel = require("../models/Role");

class roleController {
  static saveRole = async (req, res) => {
    try {
      const { roleName } = req.body;

      // Check if roleName is provided
      if (!roleName) {
        return res
          .status(400)
          .send({ code: "failed", message: "Role Name is required" });
      }

      // Check if the role already exists
      const role = await roleModel.findOne({ roleName });
      if (role) {
        return res
          .status(409)
          .send({ code: "failed", message: "Role already exists" });
      }

      // Create and save the new role
      const newRole = new roleModel({ roleName });
      await newRole.save();

      // Send a success response
      res.status(201).send({
        code: "success",
        message: "Role created successfully",
        data: newRole,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ code: "error", message: "Internal Server Error" });
    }
  };

  static getRole = async (req, res) => {
    try {
      const roles = await roleModel.find().lean(); // Use .lean() to return plain JS objects

      res.status(200).send({
        code: "success",
        message: "Role fetched successfully",
        data: roles,
      });
    } catch (err) {
      res.status(500).send({
        code: "error",
        message: "Failed to fetch roles",
        error: err.message,
      });
    }
  };
}

module.exports = roleController;
