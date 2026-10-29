const Category = require("../models/Category");
const { uploadToBlob, deleteFromBlob, isOwnBlobUrl } = require("../utils/blobStorage");

// ---------- Helpers ----------

const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Convert empty / "null" / "undefined" strings from FormData into real null
const cleanParent = (v) => (!v || v === "null" || v === "undefined" ? null : v);

// Slug includes the parent slug so "Men > Shoes" and "Women > Shoes" don't clash
const buildSlug = async (name, parentId) => {
    if (!parentId) return slugify(name);
    const parent = await Category.findById(parentId).select("slug");
    return parent ? `${parent.slug}-${slugify(name)}` : slugify(name);
};

// ---------- Create ----------

const addCategory = async (req, res) => {
    try {
        const { name, seoMetaDescription, imageUrl } = req.body;
        const parentId = cleanParent(req.body.parentId);

        // Check if name is provided
        if (!name || !name.trim()) {
            return res
                .status(400)
                .send({ code: "failed", message: "Category name is required" });
        }

        // Name must be unique within the same parent
        const existing = await Category.findOne({ name: name.trim(), parentId });
        if (existing) {
            return res
                .status(409)
                .send({ code: "failed", message: "Category already exists" });
        }

        // Image: uploaded file takes priority, otherwise use the pasted URL
        let finalImage = null;
        if (req.file) finalImage = await uploadToBlob(req.file, "categories");
        else if (imageUrl && imageUrl.trim()) finalImage = imageUrl.trim();

        const newCategory = new Category({
            name,
            parentId,
            slug: await buildSlug(name, parentId),
            seoMetaDescription,
            imageUrl: finalImage,
        });
        await newCategory.save();

        res.status(201).send({
            code: "success",
            message: "Category created successfully",
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: "error", message: "Internal Server Error" });
    }
};

// ---------- Read ----------

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate("parentId", "name slug")
            .sort({ createdAt: -1 });
        res.status(200).json({ code: "success", data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ code: "failed", message: "Category not found" });
        }
        res.status(200).json({ code: "success", data: category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

// ---------- Update ----------

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, seoMetaDescription, imageUrl, removeImage } = req.body;
        const parentId = cleanParent(req.body.parentId);

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ code: "failed", message: "Category not found" });
        }

        // A category cannot be its own parent
        if (parentId && parentId === String(category._id)) {
            return res
                .status(400)
                .json({ code: "failed", message: "Category cannot be its own parent" });
        }

        // Circular check: walk up from the new parent, we must never reach this category
        if (parentId) {
            let cur = await Category.findById(parentId).select("parentId");
            while (cur) {
                if (String(cur._id) === String(category._id)) {
                    return res
                        .status(400)
                        .json({ code: "failed", message: "Circular hierarchy not allowed" });
                }
                cur = cur.parentId
                    ? await Category.findById(cur.parentId).select("parentId")
                    : null;
            }
        }

        // Duplicate name check within the same parent (excluding this category)
        const finalName = name && name.trim() ? name.trim() : category.name;
        const duplicate = await Category.findOne({
            name: finalName,
            parentId,
            _id: { $ne: category._id },
        });
        if (duplicate) {
            return res
                .status(409)
                .json({ code: "failed", message: "Category already exists" });
        }

        // Decide the new image value
        const oldImage = category.imageUrl;
        let newImage = oldImage; // default: unchanged

        if (req.file) newImage = await uploadToBlob(req.file, "categories");
        else if (removeImage === "true") newImage = null;
        else if (imageUrl !== undefined && imageUrl.trim() !== (oldImage || ""))
            newImage = imageUrl.trim() || null;

        // Delete the old file only if it changed AND it belongs to our own blob storage
        if (oldImage && oldImage !== newImage && isOwnBlobUrl(oldImage)) {
            await deleteFromBlob(oldImage);
        }

        category.name = finalName;
        category.parentId = parentId;
        category.slug = await buildSlug(finalName, parentId);
        if (seoMetaDescription !== undefined) category.seoMetaDescription = seoMetaDescription;
        category.imageUrl = newImage;

        await category.save();

        res.status(200).json({ code: "success", message: "Category updated", data: category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

// ---------- Delete ----------

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ code: "failed", message: "Category not found" });
        }

        // Block delete if sub-categories exist
        const hasChildren = await Category.exists({ parentId: category._id });
        if (hasChildren) {
            return res
                .status(400)
                .json({ code: "failed", message: "Delete sub-categories first" });
        }

        // Remove the image from blob storage (only if it's ours)
        if (category.imageUrl && isOwnBlobUrl(category.imageUrl)) {
            await deleteFromBlob(category.imageUrl);
        }

        await category.deleteOne();

        res.status(200).json({ code: "success", message: "Category deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: "error", message: "Internal Server Error" });
    }
};

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};