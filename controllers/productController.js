const Product = require("../models/Product");
const Category = require("../models/Category");
const Role = require("../models/Role");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    const role = await Role.findById(req.user.roleId);
    if (!role || role.roleName !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can add products" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category: category._id,
      image: req.file.path,
      createdBy: req.user._id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Products (public — only active products)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Products (admin — includes soft-deleted)
const getAllProductsAdmin = async (req, res) => {
  try {
    const role = await Role.findById(req.user.roleId);
    if (!role || role.roleName !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can access this" });
    }

    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Product by ID (returns 404 if soft-deleted)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const role = await Role.findById(req.user.roleId);
    if (!role || role.roleName !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can update products" });
    }

    const { name, description, price, categoryId } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).json({ message: "Invalid category ID" });
      product.category = categoryId;
    }

    if (req.file) {
      product.image = req.file.path;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Soft Delete Product
const deleteProduct = async (req, res) => {
  try {
    const role = await Role.findById(req.user.roleId);
    if (!role || role.roleName !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can delete products" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Restore a soft-deleted Product
const restoreProduct = async (req, res) => {
  try {
    const role = await Role.findById(req.user.roleId);
    if (!role || role.roleName !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can restore products" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isDeleted = false;
    product.deletedAt = null;
    await product.save();

    res.json({ message: "Product restored successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
};
