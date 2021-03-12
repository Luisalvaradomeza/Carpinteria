const express = require("express")
const { createOrden } = require("../controllers/ordenes")
const {protect, authorize} = require("../middleware/auth")

const router = express.Router()

router.route("/").post(protect, authorize("admin", "user", "publisher"), createOrden)

module.exports = router