const mongoose = require("mongoose")

const MaderaSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: [true, "Ingrese el usuario"]
},
name: {
    type: String,
    required: [true, "Ingrese el nombre de su pedido"],
    unique: true,
    trim: true,
    maxlenght: [50, "El nombre de su pedido no puede exceder a mas de 35 caracteres"],
},

image:{
    type: String,
    default: "no-image.jpg"
},

brand: {
    type: String,
    required: [true, "Ingrese la madera que desea"]
},

category: {
    type: String,
    required: [true, "Ingrese que tipo de trabajo quiere"]
},
description:{
    type: String,
    required: [true, "Ingrese como desea su trabajo"],
    maxlenght: [700, "La descripcion no puede exceder de 700 caracteres"]
},

rating: {
    type: Number,
    default: 0,
},

reviews: {
    type: Number,
    default: 0,
},

price: {
    type: Number,
    default: 0,
},

countInStock:{
    type: Number,
    default: 0,
},
createAt:{
    type: Date,
    default: Date.now,
}

})

module.exports = mongoose.model("Madera", MaderaSchema )