const mongoose = require("mongoose")

// Conexion a base de datos
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

    console.log(`MongoDB Conectado ${conn.connection.host}`.cyan.underline.bold)



}

module.exports = connectDB