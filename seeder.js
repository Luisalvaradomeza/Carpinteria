const mongoose = require("mongoose")
const fs = require("fs")
const dotenv = require("dotenv")
require("colors")

//Cargar variables de entornos
dotenv.config({path: "./config/config.env"})

// Cargar los modelos
const User = require("./models/User")
const Madera = require("./models/Madera")
const Orden = require("./models/Orden")

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
})

// Leer archivos JSON

const maderas = JSON.parse(fs.readFileSync(`${__dirname}/_data/madera.json`, "utf-8"))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"))



const importData = async () =>{
    try {
        await User.create(users)
        await Madera.create(maderas)

        console.log("Datos importados...".green.inverse)   

        process.exit()
    } catch (err) {
        console.error(err)
    }
    
}

const deleteData = async () => {
    try {
        await Madera.deleteMany()
        await Orden.deleteMany()
        await User.deleteMany()

        console.log("Datos eliminados...".red.inverse) 
        process.exit()  
    } catch (err) {
        console.error()
    }
    
}


if(process.argv[2] === "-d"){
    deleteData()
} else if(process.argv[2] === "-i"){
   importData() 
}