const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: false },
    mobile: {
      type: String,
      required: false,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);