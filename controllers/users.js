const User = require ("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")


// @desc    Obtener todos los usuarios
// @route   GET /api/v1/auth/usuarios
// @access  Private/Admin
exports.getUsers = asyncHandler( async (req, res, next)=>{
    res.status(200).json(res.advancedResults)
})

// @desc    Obtener un usuario
// @route   GET /api/v1/auth/usuarios/:id
// @access  Private/Admin
exports.getUser = asyncHandler( async (req, res, next)=>{
    const user = await User.findById(req.params.id)
    if  (!user){
       return next( new ErrorResponse(`No se encontro el recurso con el id: ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: user })
})

// @desc    Crear usuario
// @route   POST /api/v1/auth/usuarios
// @access  Private/Admin
exports.createUser = asyncHandler( async (req, res, next)=>{
const user = await User.create(req.body)
res.status(200).json({ success: true, data: user})

})

// @desc    Actualizar usuario
// @route   PUT /api/v1/auth/usuarios/:id
// @access  Private/Admin
exports.updateUser = asyncHandler( async (req, res, next)=>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!user){
        return next(new ErrorResponse(`No se encontro el recurso con el id: ${req.params.id}`, 404))  
     }

    res.status(200).json({ success: true, data: user })
})

// @desc    Eliminar usuario
// @route   DELETE /api/v1/auth/usuarios/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler( async (req, res, next)=>{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({ success: false})  
         }

    await user.remove()
    

        res.json({ success: true, data: {}})
})
