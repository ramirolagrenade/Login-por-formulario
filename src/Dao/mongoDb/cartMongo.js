import cartModel from "../models/cartModel.js"

export default class CartMongo {

    // constructor(path){
    //     this.path = path 
    // }

    async addCart(newCart) {

        const cart = await cartModel.create(newCart)

        return {
            code: 202,
            status: 'Success',
            message: cart
        }

    }

    async getCart(cid) {

        const cart = await cartModel.findOne({ _id: cid })

        return {
            cart
        }
    }

    async updateCart(cid, pid) {
        const findCart = await cartModel.findOne({_id : cid})
        console.log(findCart)
        if(findCart){
            const findProduct = await cartModel.find({ $and: [{ _id: cid }, { product: pid }] })
            console.log(findProduct)
            if(findProduct){
                const newStock = findCart.stock + 1
                const result = await cartModel.updateOne({$and: [{_id : cid},{product : pid}]},{$set: {stock: newStock}})
                return {
                    code: 400,
                    status: 'Success',
                    message: result
                }
            }
            else{
                const result1= await cartModel.updateOne({cid:_id},{$set: {stock: 1}})
                const result= await cartModel.updateOne({cid:_id},{$set: {product: pid}})

                return {
                    code: 400,
                    status: 'Success',
                    message: result
                }
            }
        }
        else{
            return {
                code: 400,
                status: 'Success',
                message: 'Id del carrito No encontrado.'
            }
        }

        // return {
        //     code: 202,
        //     status: 'Success',
        //     message: result
        // }

    }

    async updateStock(cid, pid, stockUp) {

        const cart = await cartModel.find({ $and: [{ products: cid }, { product: pid }] })

        cart.stock = stockUp

        const result = await cartModel.updateOne({ _id: cid }, { $set: cart })

        return {
            code: 202,
            status: 'Success',
            message: result
        }

    }

    async getCarts() {

        const carts = await cartModel.find()

        return {
            code: 202,
            status: 'Success',
            message: carts
        }
    }

    async deleteCarts(id) {
        const carts = await cartModel.deleteOne({ _id: id })

        return {
            code: 202,
            status: 'Success',
            message: carts
        }
    }


}