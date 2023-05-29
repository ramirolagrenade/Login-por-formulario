import { Router } from 'express'
import MessageMongo from '../Dao/mongoDb/messageMongo.js'

const router = Router()

const messageMongo = new MessageMongo()

router.get('/', async (req,res)=>{

    const result = await messageMongo.addMessage(newProduct)


    // res.render('')
    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

export default router