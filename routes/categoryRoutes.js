// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

router.post("/", addCategory);               // Create
router.get("/", getCategories);              // Read All
router.put("/:id", updateCategory);          // Update
router.delete("/:id", deleteCategory);       // Delete

module.exports = router;
