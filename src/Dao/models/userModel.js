import mongoose, { Schema } from "mongoose"

const userCollection = 'User'

const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    password:String,
    rol: String,
    carts: {
        type:[
            {
                cart:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"carts"
                }
            }
        ],
        default: []
    }
})

schema.pre('find', function(){
    this.populate("products.product");
})

const userModel = mongoose.model(userCollection, schema)

export default userModel