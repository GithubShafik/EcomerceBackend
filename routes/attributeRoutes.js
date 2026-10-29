const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
    createAttribute,
    getAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute,
} = require("../controllers/attributeController");

const router = express.Router();

router.use(authenticate);
router.get("/", getAttributes);
router.post("/", createAttribute);
router.get("/:id", getAttributeById);
router.put("/:id", updateAttribute);
router.patch("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

module.exports = router;