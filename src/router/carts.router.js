import { Router } from 'express'
import CartMongo from '../Dao/mongoDb/cartMongo.js'
import cartModel from '../Dao/models/cartModel.js'

const router = Router()
const cartMongo = new CartMongo()

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

export default router 