import { Router } from "express"
import { generateProduct } from "../utils.js"

const router = Router()

router.get('/',(req ,res) =>{
    const cant = parseInt(req.query.cant) || 50
    let products = []
    for (let i = 0; i < cant; i++) {
        const product = generateProduct()
        products.push(product)
    }
    res.json({products})
})

export default router