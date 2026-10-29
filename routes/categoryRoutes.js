const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const upload = multer({
  storage: multer.memoryStorage(), // file is kept in RAM, then uploaded to blob storage
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PNG, JPG, WEBP, SVG allowed"));
  },
});

router.post("/", upload.single("image"), addCategory); // Create (accepts optional image file)
router.get("/", getCategories); // Read all
router.get("/:id", getCategoryById); // Read one (used to prefill the edit form)
router.put("/:id", upload.single("image"), updateCategory); // Update (accepts optional image file)
router.delete("/:id", deleteCategory); // Delete

module.exports = router;