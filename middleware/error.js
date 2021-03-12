const ErrorResponse = require("../utils/errorResponse")

const handleError = (err, req, res, next)=>{
    console.log(err)

    let error = {}

    error.statusCode = err.statusCode
    error.message = err.message

    let message

// Manejar id
if(err.name === "CastError"){
    message = `No se encontro el recurso con id: ${err.value}`
    error = new ErrorResponse(message, 404)
}

    // Validacion error MongoDB
    if(err.name === "ValidationError") {
        message = Object.values(err.errors)
        
        for(let key in err.errors) {
            if(err.errors[key].kind === "ObjectId"){
                message = `No se encontro el recurso con id: ${err.errors[key].value}`
            }
            if(err.errors[key].kind === "enum"){
                message = `No se permite el valor: ${err.errors[key].value}`
            }
        }

        error = new ErrorResponse(message, 400)
    }
// Campo duplicado
    if(err.code === 11000){
        const message = "Campo duplicado"
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message})
    }

   module.exports = handleError