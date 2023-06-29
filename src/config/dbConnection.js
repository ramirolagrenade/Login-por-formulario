import mongoose from "mongoose"
import {options} from "./options.js"

try {
    await mongoose.connect(options.mongoDB.url)
    console.log('conexion a la base de datos exitosa')
}catch{
    console.log(`Hubo un error al conectarse a la base de datos: ${error}`)
}