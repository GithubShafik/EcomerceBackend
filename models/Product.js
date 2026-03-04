const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, required: true }, // File path from multer
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Make sure you have a Category model
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Optional: track which user added
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Product", productSchema);
