const mongoose = require("mongoose")
const ErrorResponse = require("../utils/errorResponse")

const OrderItemSchema = mongoose.Schema({
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Madera",
            required: [true, "Ingrese el producto que desea obtener"],
        },
        name: {
            type: String,
            // required: [true, "Ingrese su compra"],
        },
        image: {
            type: String,
            // required: [true, "Ingrese la imagen de su compra"]
        },
        qty: {
            type: Number,
            required: [true, "Ingrese la cantidad"],
            min: [1, "La cantidad minima a vender es 1"]
            // default: 1
        },
        price: {
            type: Number,
            // required: [true, "Ingrese el precio de su compra"],
        },
        total: {
            type: Number,
            // required: [true, "Ingrese el total"],
        },
})

const OrdenSchema = mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Ingrese el usuario"]
    },
    // Ordenes de las compras
    orderItems: [OrderItemSchema],
    //Direccion de Envio
    shippingAddress:{
        address:{
            type: String,
            required: [true, "Ingrese la direccion de envio"]
        },
        city: {
            type: String,
            required: [true, "Ingrese la ciudad para el envio"]},
        postalCode:{
            type: String,
            required: [true, "Ingrese el codigo postal"]
        },
        country:{
            type: String,
            required: [true, "Ingrese el pais para su envio"]
        }
    },

    // Metodo de pago
    paymentMethod: {
        type: String,
        required: [true, "Ingrese su forma de pago"],
        enum: ["Paypal", "Stripe"]
    },

    // Resultado de los pagos
    paymentResult: {
        id:{type: String},
        status:{type: String},
        update_time:{type: String},
        email_address:{type: String}
    },

    subtotal: {
        type: Number,
        default: 0.0
    },

    // Impuesto
    taxPrice: {
        type: Number,
        default: 0.0
    },

    // Precio de envio
    shippingPrice: {
        type: Number,
        default: 0.0
    },

    // Precio total
    totalPrice: {
        type: Number,
        default: 0.0
    },

    // Pagado o no
    isPaid: {
        type: Boolean,
        required: [true, "Ingrese si la orden esta pagada"],
        default: false
    },

    // Fecha de pago
    paidAt: {
        type: Date,
    },

    // Entrega
    isDelivered: {
        type: Boolean,
        required: [true, "Indique si su pedido ha sido entregado"],
        default: false
    },

    // Fecha de entrega
    deliveredAt: {
        type: Date
    }

}, 
{
    timestamps: true,
})

// Obtener la informacion del item seleccionado
OrdenSchema.pre("save", async function(next){

    this.orderItems = await Promise.all(this.orderItems.map( async (orderItem)=>{
        const product = await mongoose.model("Madera").findById(orderItem.product)

        if(!product){
            return next(new ErrorResponse(`No se encontro el recurso con el id: ${orderItem.product}`, 404))
        }

        orderItem.name = product.name
        orderItem.price = product.price
        orderItem.image = product.image
        orderItem.total = orderItem.price * orderItem.qty


        return orderItem
    })
    )

    const subtotal = this.orderItems
    .reduce((subtotal, orderItem) => {
        return subtotal + orderItem.total
    }, 0)
    .toFixed(2)

    this.subtotal = subtotal
    this.taxPrice = (subtotal * 1.15).toFixed(2)
    this.shippingPrice = (subtotal * 1.1).toFixed(2)
    this.totalPrice = this.subtotal + this.taxPrice + this.shippingPrice


    next()
})

module.exports = mongoose.model("Orden", OrdenSchema)