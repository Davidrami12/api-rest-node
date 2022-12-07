const mongoose = require("mongoose")

const conexion = async() => {

    try{

        await mongoose.connect("mongodb://0.0.0.0:27017/mi_blog")

        console.log("Conectado correctamente a la base de datos mi_blog")

        // Parámetros dentro de objeto sólo en caso de aviso
        // useUrlParser: true
        // useUnifiedTopology: true
        // useCreateIndex: true
        
    }catch(error){
        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }

}

module.exports = {
    conexion
}
