const Articulo = require("../modelos/Articulo")
const { validarArticulo} = require("../helpers/validar")
const fs = require("fs")
const path = require("path")

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de articulos"
    })

}

const crear = (req, res) => {

    // Recoger parámetros por POST a guardar
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros)

    // Asignar valores a objetos basado en el modelo (manual o automático)

    // Guardar el artículo en la bbdd
    articulo.save((error, articuloGuardado) => {
        if (error || !articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "no se ha guardado el articulo"
            })
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con éxito !!"
        })
    })

}

const listar = (req, res) => {
    let consulta = Articulo.find({});

    if (req.params.ultimos) {
        consulta.limit(3)
    }

    consulta.sort({
            fecha: -1
        })
        .exec((error, articulos) => {

            if (error || !articulos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "no se han encontrado articulos!!"
                })
            }

            return res.status(200).send({
                status: "success",
                contador: articulos.length,
                articulos
            })

        })
}

const uno = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el artículo
    Articulo.findById(id, (error, articulo) => {
        // Si no existe devolver error
        if (error || !articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "no se han encontrado el artículo con su id"
            })
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })
    })
}

const borrar = (req, res) => {

    let articulo_id = req.params.id

    Articulo.findOneAndDelete({
        _id: articulo_id
    }, (error, articuloBorrado) => {

        if (error || !articuloBorrado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar por id"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Método de borrar"
        })
    })
}


const editar = (req, res) => {
    // Recoger id articulo a editar
    let articulo_id = req.params.id

    // Recoger datos del body
    let parametros = req.body

    // Validar datos
    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({
        _id: articulo_id
    }, req.body, {
        new: true
    }, (error, articuloActualizado) => {

        if (error || !articuloActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar"
            })
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado"
        })

    })
}

// Método subir
const subir = (req, res) => {

    //Configurar multer para la subida de archivos

    // Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "Error",
            mensaje: "Petición inválida"
        })
    }

    // Nombre del archivo
    let nombre_archivo = req.file.originalname

    // Extensión del archivo
    let archivo_split = nombre_archivo.split("\.") // va a devolver un array
    let archivo_extension = archivo_split[1] //jpg, pnj...

    // Comprobar extension correcta
    if (archivo_extension != "png" && archivo_extension != "jpg" &&
        archivo_extension != "jpeg" && archivo_extension != "gif") {
        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(200).json({
                status: "error",
                mensaje: "Archivo inválido"
            })
        })
    } else {

        // Recoger id articulo a editar
        let articulo_id = req.params.id

        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({
            _id: articulo_id
        }, {imagen: req.file.filename}, {
            new: true
        }, (error, articuloActualizado) => {

            if (error || !articuloActualizado) {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Error al actualizar"
                })
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            })
        })
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero
    let ruta = "./imagenes/articulos/"+fichero
    fs.stat(ruta, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta))
        }else{
            return res.status(400).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta
            })
        }
    })
}

const buscador = (req, res) => {
    // Sacar el string de búsqueda
    let busqueda = req.params.busqueda

    // Find OR 
    Articulo.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}}, // si el título incluye este string de búsqueda
        {"contenido": {"$regex": busqueda, "$options": "i"}}
    ]})
    .sort({fecha: -1}) // Orden
    .exec((error, articulosEncontrados) => {
        if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
            return res.status(404).json({
                status: "Error",
                mensaje: "No se han encontrado artículos"
            })
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados
        })
    })
    

    // Ejecutar consulta

    // Devolver resultado
}

module.exports = {
    prueba,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}