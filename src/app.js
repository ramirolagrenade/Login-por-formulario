import express from 'express' 
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import "./config/dbConnection.js"
import cartRouter from './router/carts.router.js'
import productRouter from './router/products.router.js'
import messageRouter from './router/message.router.js'
import viewRouter from './router/router.views.js'
import userRouter from './router/user.router.js'
import mockingRouter from './router/mockingproducts.router.js'
import errorProduct from './router/errorProduct.router.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { addLogger } from './logger/logger.js'
import loggerRouter from './router/logger.router.js'

import initializePassport from './config/passport.config.js'
import { options } from './config/options.js'


export const PORT = options.server.port 
const app = express() 
const httServer = app.listen(PORT,() => console.log( `servidro funcionando en el PORT: ${PORT}`))

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.use(session({
    store: new MongoStore({
        mongoUrl: options.mongoDB.url,
        ttl: 1500
    }),
    secret: options.server.secretSession,
    resave: false,
    saveUninitialized:false
}))

initializePassport()
app.use (passport.initialize())
app.use(passport.session())

app.engine("handlebars",handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use('/', viewRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', messageRouter)
app.use('/api/products', productRouter)
app.use('/api/session', userRouter)
app.use('/mockingproducts', mockingRouter)

app.use('/errorProduct', errorProduct)
app.use(errorHandler)

app.use("/niveles", loggerRouter)
app.use(addLogger)