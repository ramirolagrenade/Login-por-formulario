import { Router } from 'express'
import CartMongo from '../Dao/mongoDb/cartMongo.js'
import cartModel from '../Dao/models/cartModel.js'
import ProductMongo from '../Dao/mongoDb/productMongo.js'
import {v4 as uuidv4} from "uuid"
import productModel from '../Dao/models/productModel.js'
import { options } from '../config/options.js'
import { transporter } from '../config/gmail.js'

const router = Router()
const cartMongo = new CartMongo()
const productMongo = new ProductMongo

router.post('/', async (req, res) => {
    const newCart = { products: [] }

    const result = await cartMongo.addCart(newCart)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const result = await cartMongo.updateCart(cid, pid)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.get('/', async (req, res) => {

    const result = await cartMongo.getCarts()

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})


router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid

    const result = await cartMongo.deleteCarts(cid)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})
///////////////////////////////////////////
router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const carrito = await cartModel.find({ $and: [{ products: cid }, { product: pid }] })

    const result = await cartMongo.deleteCarts(carrito._id)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.put('/:cid', async (req, res) => {
    const cid = req.params.cid

    const { product, stock } = req.body

    if (!product || !stock) {
        return res.status(400).send({
            error: 'Datos incompletos'
        })
    }

    const cart = [{
        product,
        stock
    }]

    const result = await cartMongo.updateCart(cid, cart)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.put('/:cid/products/:pid', async (req, res) => {
    const pid = req.query.pid
    const cid = req.query.cid

    const stockUp = req.body

    const result = await cartMongo.updateStock(cid, pid, stockUp)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.post("/:cid/purchase",async(req,res)=>{
    try{
        const cartId = req.params.cid
        const cart = cartMongo.findById(cartId)
        if (cart){
            if(!cart.products.length){
                return res.send('El carrito esta vacio.')
            }

            const ticketProduct = []
            const rejectProduct= []
            let total = 0

            for (let i = 0; i < cart.products.length; i++) {
                const cartProduct = cart.products[i]
                const productDB = await productMongo.findById(cartProduct.id)
                if(cartProduct.quantity <= productDB.stock){
                    ticketProduct.push({
                        productId: cartProduct.id,
                        price: cartProduct.price
                    })
                    total += cartProduct.quantity * productDB.price
                }

            }
            const newTicket = {
                code: uuidv4(),
                purchase_datatime : new Date().toLocaleDateString(),
                amount : total,
                purchaser : req.user.email,
                product: ticketProduct
            }

            const ticketCreate = await ticketCreate.create(newTicket)
            cartModel.updateOne({_id:cartId}, cart)

            const mail = await transporter.sendMail({
                from: options.gmail.adminAccount,
                to: req.session.user,
                subject: "Compra de Productos TLP.",
                html: ticketCreate
            })
            console.log('contenido del mail: ' + mail)

            res.send(ticketCreate)

        }else{
            res.send("El carrito no existe.")
        }

    } catch{
        res.send(error.message)
    }
})

export default router