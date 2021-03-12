// Programacion con express
const express = require ("express")
// Dotenv
const dotenv = require ("dotenv")
// Uso de cookies
const cookieParser = require("cookie-parser")
// Revision de errores
const morgan = require("morgan")
//Uso de colores en el terminal
const colors = require("colors")
// Conexion de base de datos
const connectDB = require("./config/db")
// Errores
// const handleError = require("./middleware/error") 
const handleError = require("./middleware/error")


// Cargar Variables Entorno
dotenv.config({path:"./config/config.env"})

const app = express()

app.use(express.json())

// Usar cookie
app.use(cookieParser())


// Conexion base de datos
connectDB()

// Uso del logger
app.use(morgan("dev"))

// Importacion de rutas
const madera = require("./routes/madera")
const ordenes = require("./routes/ordenes")
const auth = require("./routes/auth")
const users = require("./routes/users")

// Montar rutas
app.use("/api/v1/Madera", madera)
app.use("/api/v1/ordenes", ordenes)
app.use("/api/v1/auth", auth)
app.use("/api/v1/auth/usuarios", users)

// Manejo del middleware para errores
// Manejo de errores   
app.use(handleError)



const PORT = process.env.PORT || 5000

const server = app.listen(PORT, ()=> {
    console.log(`El servidor esta corriendo en ${process.env.NODE_ENV} en el puerto ${PORT}`.green.bold)
})

process.on("unhandledRejection", (err, promise) =>{
    console.log(`Error: ${err.message}`.red.bold.underline)
    server.close(()=>{
        process.exit(1)
    })
})