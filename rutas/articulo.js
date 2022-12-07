const express = require("express")
const router = express.Router()
const ArticuloControlador = require("../controladores/articulo")
const multer = require("multer")

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/')
    },
    filename: (req, file, cb) => {
        cb(null, "articulo" +  Date.now() + file.originalname)
    }
})

const subidas = multer({storage: almacenamiento})


// Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloControlador.prueba)

// Ruta útil
router.post("/crear", ArticuloControlador.crear) // Usamos POST porque vamos a guardar un recurso en mi bbdd
router.get("/articulos/:ultimos?", ArticuloControlador.listar)
router.get("/articulo/:id", ArticuloControlador.uno)
router.delete("/articulo/:id", ArticuloControlador.borrar)
router.put("/articulo/:id", ArticuloControlador.editar) // PUT se usa para actualizar un recurso en el backend
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlador.subir)
router.get("/imagen/:fichero", ArticuloControlador.imagen)
router.get("/buscar/:busqueda", ArticuloControlador.buscador)



module.exports = router;