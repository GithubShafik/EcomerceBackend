const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderStatus = require("../models/OrderStatus");


const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { products, paymentMethod, shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
            return res.status(400).json({ message: "Shipping address is incomplete or missing." });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required." });
        }
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products provided." });
        }

        const placedStatus = await OrderStatus.findOne({ name: "Placed" });
        if (!placedStatus) {
            return res.status(500).json({ message: "Placed status not found in database" });
        }

        // Calculate total and build products array
        let totalAmount = 0;
        const productDetails = [];

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            totalAmount += product.price * item.quantity;

            productDetails.push({
                product: product._id,
                quantity: item.quantity,
            });
        }

        const newOrder = new Order({
            userId,
            products: productDetails,
            paymentMethod,
            totalAmount,
            orderStatus: placedStatus,
            shippingAddress,
        });

        const savedOrder = await newOrder.save();
        await savedOrder.populate("orderStatus", "name");
        await savedOrder.populate("products.product", "name price image");

        res.status(201).json({ message: "Order placed successfully", order: savedOrder });

    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 2. GET /api/orders/me — get current user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate("products.product", "name price image")
            .populate("orderStatus", "name")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
};

// 3. GET /api/orders — super_admin gets all orders
const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== "super_admin") {
            return res.status(403).json({ message: "Only super_admin can access all orders" });
        }

        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("products.product", "name price image")
            .populate("orderStatus", "name")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch all orders", error: err.message });
    }
};

// 4. GET /api/orders/:id — get one order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("products.product", "name price image")
            .populate("orderStatus", "name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (req.user.role !== "super_admin" && !order.userId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order", error: err.message });
    }
};

// 5. PUT /api/orders/:id/status — update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { statusId } = req.body;

        if (req.user.roleId.roleName !== "super_admin") {
            return res.status(403).json({ message: "Only super_admin can update status" });
        }

        const status = await OrderStatus.findById(statusId);
        if (!status) {
            return res.status(400).json({ message: "Invalid status ID" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: status._id },
            { new: true }
        ).populate("orderStatus", "name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order status updated", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to update order", error: err.message });
    }
};

// 6. GET /api/orders/statuses — get all order statuses
const getOrderStatuses = async (req, res) => {
    try {
        const statuses = await OrderStatus.find();
        res.json(statuses);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch order statuses", error: err.message });
    }
};

// 7. POST /api/orders/statuses — create a new order status (super_admin)
const createOrderStatus = async (req, res) => {
    try {
        if (req.user.roleId.roleName !== "super_admin") {
            return res.status(403).json({ message: "Only super_admin can create statuses" });
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Status name is required" });
        }

        const existing = await OrderStatus.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Status already exists" });
        }

        const newStatus = new OrderStatus({ name });
        const saved = await newStatus.save();
        res.status(201).json({ message: "Order status created", status: saved });
    } catch (err) {
        res.status(500).json({ message: "Failed to create order status", error: err.message });
    }
};

// 8. DELETE /api/orders/statuses/:id — delete an order status (super_admin)
const deleteOrderStatus = async (req, res) => {
    try {
        if (req.user.roleId.roleName !== "super_admin") {
            return res.status(403).json({ message: "Only super_admin can delete statuses" });
        }

        const status = await OrderStatus.findByIdAndDelete(req.params.id);
        if (!status) {
            return res.status(404).json({ message: "Order status not found" });
        }

        res.json({ message: "Order status deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order status", error: err.message });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStatuses,
    createOrderStatus,
    deleteOrderStatus,
};
