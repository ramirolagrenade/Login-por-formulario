import { Router } from "express"
import ProductMongo from "../Dao/mongoDb/productMongo.js"
import productModel from "../Dao/models/productModel.js"

const router = Router()

const productMongo = new ProductMongo()

router.get('/', async (req, res) => {

    const result = await productMongo.getProducts()

    res.status(result.code).send({
        status: result.status
    })

})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid

    const result = await productMongo.getProduct(pid);

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.post('/', async (req, res) => {
    const { title, description, price, stock, category, thumbnails } = req.body

    if (!title || !description || !price || !stock || !category) {
        return res.status(400).send({
            error: 'Datos incompletos'
        })
    }

    const newProduct = {
        title,
        description,
        price,
        stock,
        category,
        thumbnails
    }

    const result = await productMongo.addProduct(newProduct)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })

})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid

    const { title, description, code, price, stock, category, thumbnails } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({
            error: 'Datos incompletos'
        })
    }

    const product = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    }

    const result = await productMongo.updateProduct(pid, product)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid

    const result = await productMongo.deleteProduct(pid)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

export default router