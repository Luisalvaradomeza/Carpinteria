const mongoose = require ("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Ingrese el nombre del usuario"],
    },
    email:{
        type: String,
        required: [true, "Ingrese el email del usuario"],
        unique: [true, "El email ya existe"], 
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Por favor ingrese una direccion de correo valida",
        ],
    },
    password:{
        type: String,
        required: [true, "Ingrese su contraseña"],
        minlength: [6, "La contraseña necesita minimo 6 caracteres"],
        select: false
    },
    // isAdmin:{
    //     type: Boolean,
    //     required: [true, "Indique si el usuario es administrador"],
    //     default: false
    // }
    role: {
        type: String,
        enum: ["publisher", "user"],
        default: "user"
    }
},
{
    timestamps: true,
}
)

// Encriptar contraseña usando bcrypt
UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Firmar Jwt y retornarlo
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Verficar si la contraseña coincide con la encriptada
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)