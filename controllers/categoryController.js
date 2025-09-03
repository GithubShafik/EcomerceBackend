const Category = require("../models/Category");



const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if name is provided
        if (!name) {
            return res
                .status(400)
                .send({ code: "failed", message: "Role Name is required" });
        }

        // Check if the role already exists
        const role = await roleModel.findOne({ name });
        if (role) {
            return res
                .status(409)
                .send({ code: "failed", message: "Role already exists" });
        }

        // Create and save the new role
        const newRole = new roleModel({ name });
        await newRole.save();

        // Send a success response
        res.status(201).send({
            code: "success",
            message: "Role created successfully",
            data: newRole,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: "error", message: "Internal Server Error" });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ code: "success", data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!updated) {
            return res.status(404).json({ code: "failed", message: "Category not found" });
        }

        res.status(200).json({ code: "success", message: "Category updated", data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ code: "failed", message: "Category not found" });
        }

        res.status(200).json({ code: "success", message: "Category deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

module.exports = {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};


