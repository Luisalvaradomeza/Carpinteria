const express = require("express")
const {getMaderas, 
    createMadera, 
    getMadera, 
    updateMadera, 
    deleteMadera 
} = require("../controllers/madera")

const {protect, authorize} = require("../middleware/auth")
const advancedResults = require("../middleware/advancedResults")
const Madera = require("../models/Madera")

const router = express.Router()

router.route("/").get(advancedResults(Madera), getMaderas).post(protect, authorize("admin", "publisher"), createMadera)
router.route("/:id").get(getMadera).put(protect, authorize("admin", "publisher"), updateMadera).delete(protect, authorize("admin", "publisher"), deleteMadera)


module.exports = router