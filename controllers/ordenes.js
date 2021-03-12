const Orden = require("../models/Orden")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Crear una orden
// @route   POST /api/v1/ordenes
// @access  Private
exports.createOrden = asyncHandler( async (req, res, next)=>{
    if(!req.body.orderItems || !req.body.orderItems.length > 0){
        return next(
            new ErrorResponse("Se requiere como minimo la orden de una compra", 400))
    }

    req.body.user = req.user.id


    const orden = await Orden.create(req.body)
    res.status(200).json({ success: true, data: orden})
    
    })