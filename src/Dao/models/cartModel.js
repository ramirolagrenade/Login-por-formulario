import mongoose from "mongoose"

const collection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                quantity:{
                    type: Number,
                    default: 1
                } 
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function(){
    this.populate("products.product");
})

const cartModel = mongoose.model(collection, cartSchema)

export default cartModel