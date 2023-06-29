import { Router } from 'express'


const router = Router()

router.get('/', async (req, res) => {

    const result = await productMongo.getProducts()

    res.status(result.code).send({
        status: result.status
    })

})
