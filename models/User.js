const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: false }, // Turf reference for Turf Admin
});

module.exports = mongoose.model("User", userSchema);
