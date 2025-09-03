const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

// 🛒 Place an order (user)
router.post("/", authenticate, placeOrder);

// 📋 Get current user's orders
router.get("/me", authenticate, getMyOrders);

// 📋 Get all orders (super_admin only)
router.get("/", authenticate, getAllOrders);

// 📦 Get a single order by ID (user or admin)
router.get("/:id", authenticate, getOrderById);

// 🛠️ Update order status (super_admin only)
router.put("/:id/status", authenticate, updateOrderStatus);

module.exports = router;
