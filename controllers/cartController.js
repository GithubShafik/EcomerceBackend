// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // create new cart for user
            cart = new Cart({
                userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // check if product exists in cart
            const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity; // update quantity
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        await cart.populate("items.product", "name price image");

        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// controllers/cartController.js
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.product", "name price image");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
        }

        res.json({ cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
    }
};

// controllers/cartController.js
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ message: "Valid productId and quantity required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate("items.product", "name price image");

        res.json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to update cart item", error: err.message });
    }
};


// controllers/cartController.js
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => !item.product.equals(productId));

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await cart.save();
        await cart.populate("items.product", "name price image");

        res.json({ message: "Product removed from cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove item", error: err.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
};
