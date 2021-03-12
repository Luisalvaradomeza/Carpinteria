const express = require("express")
const { register, login, getMe, updateDetails, updatePassword } = require("../controllers/auth")
const {protect, authorize} = require("../middleware/auth")

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/miperfil").get(protect,getMe)
router.route("/actualizacionDetalles").put(protect, authorize("user", "publisher", "admin"), updateDetails)
router.route("/actualizacionpassword").put(protect, authorize("user", "publisher", "admin"), updatePassword)

module.exports = router