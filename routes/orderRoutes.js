const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatuses,
  createOrderStatus,
  deleteOrderStatus,
} = require("../controllers/orderController");

// 📊 Get all order statuses
router.get("/statuses", authenticate, getOrderStatuses);

// ➕ Create a new order status (super_admin)
router.post("/statuses", authenticate, createOrderStatus);

// ❌ Delete an order status (super_admin)
router.delete("/statuses/:id", authenticate, deleteOrderStatus);

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
