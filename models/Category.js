const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    seoMetaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);