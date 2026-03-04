const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
} = require("../controllers/productController");

// Public: browsing products (only active)
router.get("/", getAllProducts);

// Protected: admin gets all products (including soft-deleted)
router.get("/admin/all", authenticate, getAllProductsAdmin);

// Public: single product by ID
router.get("/:id", getProductById);

// Protected: modifying products requires auth
router.post("/", authenticate, upload.single("image"), createProduct);
router.put("/:id", authenticate, upload.single("image"), updateProduct);
router.put("/:id/restore", authenticate, restoreProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
