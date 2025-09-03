const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

const roleModel = mongoose.model("Role",roleSchema)
module.exports = roleModel;

// super_admin', 'turf_admin', 'user'
