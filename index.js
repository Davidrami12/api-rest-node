const { conexion } = require("./basedatos/conexion");
const express = require("express")
const cors = require("cors");
const res = require("express/lib/response");

// Inicializar app
console.log("App de node arrancada");

//Conectar a la base da datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()) // recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})) // form-urlencoded

// RUTAS

//Rutas prueba hardcodeadas
const rutas_articulo = require("./rutas/articulo")

// cargo las rutas
app.use("/api", rutas_articulo)


app.get("/", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando")

    return res.status(200).send(`
    <h1>Probando un api rest con nodejs</h1>`) // El status es elñ código que devuelve el http
})

// Crear servidor y configurar peticiones hhtp
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: " + puerto)
})