const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Protected: All routes require auth
router.post("/", authenticate, upload.single("image"), createProduct);
router.get("/", authenticate, getAllProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, upload.single("image"), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
