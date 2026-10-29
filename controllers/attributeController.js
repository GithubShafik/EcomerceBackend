const mongoose = require("mongoose");
const Attribute = require("../models/attribute");
const Category = require("../models/Category");
const Role = require("../models/Role");

const editableFields = new Set(["name", "inputType", "values", "categories", "status"]);
const validInputTypes = new Set(["text", "dropdown", "multi-select"]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isSuperAdmin = async (user) => {
    const roleId = user?.roleId?._id || user?.roleId;
    if (!roleId) return false;

    const role = await Role.findById(roleId).select("roleName");
    return role?.roleName === "super_admin";
};

const authorizeSuperAdmin = async (req, res) => {
    if (await isSuperAdmin(req.user)) return true;

    res.status(403).json({ message: "Only super_admin can manage attributes." });
    return false;
};

const prepareAttributeData = async (body, existing, requireFields = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Request body must be an object." };
    }

    const keys = Object.keys(body);
    const unsupportedField = keys.find((key) => !editableFields.has(key));
    if (unsupportedField) {
        return { error: `Unsupported attribute field: ${unsupportedField}.` };
    }

    if (requireFields && (!body.name || !body.inputType)) {
        return { error: "Name and inputType are required." };
    }
    if (!requireFields && keys.length === 0) {
        return { error: "At least one attribute field must be provided." };
    }

    const data = {};
    if (Object.hasOwn(body, "name")) {
        if (typeof body.name !== "string" || !body.name.trim()) {
            return { error: "Name must be a non-empty string." };
        }
        data.name = body.name.trim();
    }

    if (Object.hasOwn(body, "inputType")) {
        if (typeof body.inputType !== "string" || !validInputTypes.has(body.inputType)) {
            return { error: "inputType must be text, dropdown, or multi-select." };
        }
        data.inputType = body.inputType;
    }

    if (Object.hasOwn(body, "values")) {
        if (!Array.isArray(body.values) || body.values.some((value) => typeof value !== "string" || !value.trim())) {
            return { error: "Values must be an array of non-empty strings." };
        }
        const values = body.values.map((value) => value.trim());
        if (new Set(values.map((value) => value.toLocaleLowerCase())).size !== values.length) {
            return { error: "Values must not contain duplicates." };
        }
        data.values = values;
    }

    if (Object.hasOwn(body, "categories")) {
        if (
            !Array.isArray(body.categories) ||
            body.categories.some(
                (id) => typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)
            )
        ) {
            return { error: "Categories must be an array of valid category IDs." };
        }

        const categoryIds = [...new Set(body.categories.map((id) => id.toLowerCase()))];
        const foundCategories = await Category.find({ _id: { $in: categoryIds } }).select("_id");
        if (foundCategories.length !== categoryIds.length) {
            return { error: "One or more categories do not exist." };
        }
        data.categories = categoryIds;
    }

    if (Object.hasOwn(body, "status")) {
        if (typeof body.status !== "boolean") {
            return { error: "Status must be a boolean." };
        }
        data.status = body.status;
    }

    const inputType = data.inputType ?? existing?.inputType;
    const values = data.values ?? existing?.values ?? [];
    if (inputType === "text" && values.length > 0) {
        return { error: "Text attributes cannot have predefined values." };
    }
    if ((inputType === "dropdown" || inputType === "multi-select") && values.length === 0) {
        return { error: `${inputType} attributes require at least one value.` };
    }

    return { data };
};

const sendError = (res, error, operation) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
        return res.status(409).json({ message: "An attribute with this name already exists." });
    }

    console.error(`${operation} error:`, error);
    return res.status(500).json({ message: `Failed to ${operation}.` });
};

const getAttributes = async (req, res) => {
    try {
        if (!(await authorizeSuperAdmin(req, res))) return;
        const attributes = await Attribute.find()
            .populate("categories", "name slug")
            .sort({ updatedAt: -1 });
        return res.json({ data: attributes });
    } catch (error) {
        return sendError(res, error, "fetch attributes");
    }
};

const getAttributeById = async (req, res) => {
    try {
        if (!(await authorizeSuperAdmin(req, res))) return;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid attribute ID." });
        }

        const attribute = await Attribute.findById(req.params.id).populate("categories", "name slug");
        if (!attribute) return res.status(404).json({ message: "Attribute not found." });

        return res.json({ data: attribute });
    } catch (error) {
        return sendError(res, error, "fetch attribute");
    }
};

const createAttribute = async (req, res) => {
    try {
        if (!(await authorizeSuperAdmin(req, res))) return;
        const { data, error } = await prepareAttributeData(req.body, null, true);
        if (error) return res.status(400).json({ message: error });

        const duplicate = await Attribute.findOne({
            name: { $regex: `^${escapeRegex(data.name)}$`, $options: "i" },
        });
        if (duplicate) {
            return res.status(409).json({ message: "An attribute with this name already exists." });
        }

        const attribute = await Attribute.create(data);
        await attribute.populate("categories", "name slug");
        return res.status(201).json({ message: "Attribute created successfully.", data: attribute });
    } catch (error) {
        return sendError(res, error, "create attribute");
    }
};

const updateAttribute = async (req, res) => {
    try {
        if (!(await authorizeSuperAdmin(req, res))) return;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid attribute ID." });
        }

        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) return res.status(404).json({ message: "Attribute not found." });

        const { data, error } = await prepareAttributeData(req.body, attribute);
        if (error) return res.status(400).json({ message: error });

        if (data.name) {
            const duplicate = await Attribute.findOne({
                _id: { $ne: attribute._id },
                name: { $regex: `^${escapeRegex(data.name)}$`, $options: "i" },
            });
            if (duplicate) {
                return res.status(409).json({ message: "An attribute with this name already exists." });
            }
        }

        Object.assign(attribute, data);
        await attribute.save();
        await attribute.populate("categories", "name slug");
        return res.json({ message: "Attribute updated successfully.", data: attribute });
    } catch (error) {
        return sendError(res, error, "update attribute");
    }
};

const deleteAttribute = async (req, res) => {
    try {
        if (!(await authorizeSuperAdmin(req, res))) return;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid attribute ID." });
        }

        const attribute = await Attribute.findByIdAndDelete(req.params.id);
        if (!attribute) return res.status(404).json({ message: "Attribute not found." });

        return res.json({ message: "Attribute deleted successfully." });
    } catch (error) {
        return sendError(res, error, "delete attribute");
    }
};

module.exports = {
    createAttribute,
    getAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute,
};
