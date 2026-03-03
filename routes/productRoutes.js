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

// Public: browsing products
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected: modifying products requires auth
router.post("/", authenticate, upload.single("image"), createProduct);
router.put("/:id", authenticate, upload.single("image"), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
