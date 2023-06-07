import express from 'express' 
import handlebars from 'express-handlebars'
import __dirname from './utils.js' 
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import cartRouter from './router/carts.router.js'
import productRouter from './router/products.router.js'
import messageRouter from './router/message.router.js'
import viewRouter from './router/router.views.js'
import userRouter from './router/user.router.js'
import initializePassport from './config/passport.config.js'


const PORT = 8080 
const MONGO = 'mongodb+srv://ramirolagrenade:8MI6v3LKbJK12lLw@ecommerce.24fvet8.mongodb.net/rl' 

const app = express() 

const connection = mongoose.connect(MONGO) 

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.use(session({
    store: new MongoStore({
        mongoUrl:MONGO,
        ttl: 1500
    }),
    secret:'CoderSecret',
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



app.listen(PORT, ()=>{
    console.log('Servidor funcionando en el puerto: ' + PORT) 
})