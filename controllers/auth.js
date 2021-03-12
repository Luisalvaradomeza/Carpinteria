const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Registrar usuario
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next)=> {
    const { name, email, password, role} = req.body

    // Crear usuario
    const user = await User.create({
        name: name, 
        email: email, 
        password: password,
        role
    })

    sendTokenResponse(user, 200, res)
})


// @desc    Iniciar sesion
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next)=> {
    const { email, password} = req.body

    // Validar email y password
    if(!email || !password){
        return next(new ErrorResponse("Por favor introduzca un correo y contraseña valido", 400))
    }

    // Verificar usuario
    const user = await User.findOne({email}).select("+password")

    if(!user) {
        return next(new ErrorResponse("Credenciales no validas", 401))
    }

    // Verificar la contraseña coincidencia con la BD
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse("Credenciales no validas", 401))
    }

    sendTokenResponse(user, 200, res)
    
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV ==="production"){
        options.secure = true
    }

    res.status(statusCode).cookie("Token", token, options).json({ success: true, token })  
}

// @desc    Obtener informacion del usuario actual
// @route   POST /api/v1/auth/miperfil
// @access  Private
exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user._id)
    res.status(200).json({ success: true, data: user })
})

// @desc    Actulizar detalles del usuario
// @route   POST /api/v1/auth/actualizacionDetalles
// @access  Private
exports.updateDetails = asyncHandler(async(req, res, next) => {
    const fieldsToUpdate ={
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ success: true, data: user })
})

// @desc    Actulizar contraseña del usuario
// @route   POST /api/v1/auth/actualizacionpassword
// @access  Private
exports.updatePassword = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    // Verificar contraseña actual
    if(!(await user.matchPassword(req.body.currentPassword)))
    {
        return next(new ErrorResponse("La contraseña es incorrecta", 401))
    }

    user.password = req.body.newPassword

    await user.save()

    sendTokenResponse(user, 200, res)
})