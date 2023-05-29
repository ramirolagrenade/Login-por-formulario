import mongoose, { Schema } from "mongoose"

const userCollection = 'User'

const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    password:String,
    rol: String
})

const userModel = mongoose.model(userCollection, schema)

export default userModel