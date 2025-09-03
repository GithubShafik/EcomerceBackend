const express = require("express")
const roleController = require("../controllers/roleController.js")


const router =  express.Router()


router.post("/UserRoles",roleController.saveRole)
router.get("/getAllRoles",roleController.getRole)


module.exports = router;
