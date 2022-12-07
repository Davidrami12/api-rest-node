const { Schema, model } = require("mongoose")

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now // Esto es un tipo de método de mongoose
    },
    imagen: {
        type: String,
        default: "default.png"
    }
}); // Este va a ser el esquema o formato que van a tener cada uno de mis artículos

module.exports = model("Articulo", ArticuloSchema, "articulos")