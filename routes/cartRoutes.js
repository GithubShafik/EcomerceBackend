// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.put("/cart", authMiddleware, updateCartItem);
router.delete("/cart/:productId", authMiddleware, removeCartItem);

module.exports = router;
