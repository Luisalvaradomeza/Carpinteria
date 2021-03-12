const Madera = require ("../models/Madera")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")


// @desc    Obtener todos los pedidos
// @route   GET /api/v1/Madera
// @access  Public
exports.getMaderas = asyncHandler( async (req, res, next)=>{
    res.status(200).json(res.advancedResults)
})

// @desc    Obtener un pedido especifico
// @route   GET /api/v1/Madera/:id
// @access  Public
exports.getMadera = asyncHandler( async (req, res, next)=>{
    const madera = await Madera.findById(req.params.id)
    if  (!madera){
       return next( new ErrorResponse(`No se encontro el recurso con el id: ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: madera })
})

// @desc    Agregar un pedido
// @route   POST /api/v1/Madera
// @access  Private
exports.createMadera = asyncHandler( async (req, res, next)=>{
req.body.user = req.user.id
const madera = await Madera.create(req.body)
res.status(200).json({ success: true, data: madera})

})

// @desc    Actualizar un pedido
// @route   PUT /api/v1/Madera/:id
// @access  Private
exports.updateMadera = asyncHandler( async (req, res, next)=>{
    let madera = await Madera.findById(req.params.id)
    if(!madera){
        return next(new ErrorResponse(`No se encontro el recurso con el id: ${req.params.id}`, 404))  
     }
     // Asegurarse que el usuario es el propietario del producto
     if(req.user.id !== madera.user.toString() && req.user.role !== "admin") {
        return next(new ErrorResponse("El usuario no esta autorizado para actualizar este producto", 401))
     }

     madera = await Madera.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
     })

    res.status(200).json({ success: true, data: madera})
})

// @desc    Eliminar un pedido
// @route   DELETE /api/v1/Madera/:id
// @access  Private
exports.deleteMadera = asyncHandler( async (req, res, next)=>{
        let madera= await Madera.findById(req.params.id)
        if(!madera){
            return res.status(404).json({ success: false})  
         }

// Asegurarse que el usuario es el propietario del producto
    if(req.user.id !== madera.user.toString() && req.user.role !== "admin") {
    return next(new ErrorResponse("El usuario no esta autorizado para eliminar este producto", 401))
    }

    madera.remove()
    

        res.json({ success: true, data: {}})
})
