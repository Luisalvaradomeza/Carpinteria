const express = require ("express")
const dotenv = require ("dotenv")

const app = express()

// Cargar Variables Entorno
dotenv.config({path:"./config/config.env"})

app.get("/", (req, res)=>{
res.send("Hola Mundo")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`El servidor esta corriendo en ${process.env.NODE_ENV} en el puerto ${PORT}`)
})