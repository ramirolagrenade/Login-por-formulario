import { Router } from "express"
import { CustomError } from "../service/customError.service.js"
import { EError } from "../enums/EError.js"
import { generateProductErrorInfo } from "../service/productErrorInfo.js"

const router = Router()

const products = []

router.get("/", (req,res)=>{
    res.json({status:"succes",data:products})
})

router.post("/", (req,res)=>{
    const {title, price} = req.body
    if(!title || !price){
        CustomError.createError({
            name: "Product create error",
            cause: generateProductErrorInfo(req.body),
            message: "Error creando el producto",
            errorCode: EError.INVALID_JSON
        })
    }

    const newProduct = {
        id: products.length +1,
        title,
        price
    }

    products.push(newProduct);
       
    res.json({status:"succes",data:products})
})

export default router 