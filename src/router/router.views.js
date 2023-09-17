import { Router } from "express"
import ProductMongo from "../Dao/mongoDb/productMongo.js"
import CartMongo from '../Dao/mongoDb/cartMongo.js'
import UserMongo from "../Dao/mongoDb/loginMongo.js"

const router = Router()

const productMongo = new ProductMongo()
const cartMongo = new CartMongo()
const userMongo = new UserMongo()

const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/');
    next();
}

router.get('/', async (req, res) =>{
    res.render('login')
})

router.get('/register', async(req,res)=>{
    res.render('register')
})

router.get('/products', privateAcces , async (req, res) => {

    const queryOptions = req.query
    const result = await productMongo.getPaginate(queryOptions)
    const user = req.session.user

    if(user.rol === 'Administrador'){
        user.rol = true
    }else{
        user.rol = false
    }

    const products = result.products
    const hasPrevPage = result.hasPrevPage
    const hasNextPage = result.hasNextPage
    const nextPage = result.nextPage
    const prevPage = result.prevPage
    const totalPages = result.totalPages
    const page = result.page

    if (page > totalPages || page < 1) {
        res.status(404).send({
            status: Error,
            menssage: 'Pagina no encontrada'
        })
    }

    if (!parseInt(page)) {
        res.status(404).send({
            status: Error,
            menssage: 'Pagina no encontrada'
        })
    }

    res.render('products', {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        totalPages,
        user
    })

    
})

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid

    const carts = await cartMongo.getCart(cid)

    res.render('carts',{
        carts
    })
})

router.get('/profile', privateAcces ,(req,res)=>{
    const user = req.session.user

    if(user.rol === false){user.rol='Usuario'}
    if(user.rol === true){user.rol='Administrador'}

    res.render('profile',{
        user
    })
})

router.get("/forgot-password",(req,res)=>{
    res.render("forgotPassword")
})

router.get("/reset-password",(req,res)=>{
    const token = req.query.token
    res.render("resetPassword",{token})
})

export default router