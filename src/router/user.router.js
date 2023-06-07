import { Router } from "express"
import UserMongo from '../Dao/mongoDb/loginMongo.js'
import { createHash, validatePassword } from '../utils.js'
import passport from 'passport'

const router = Router()

const userMongo = new UserMongo()

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req,res) =>{
    // let rol = 'Usuario'
    // const {first_name, last_name, email, password} = req.body
    // if(email==='adminCoder@coder.com' & password==='adminCod3r123'){
    //     rol = 'Administrador'
    // }

    // const user = {
    //     first_name,
    //     last_name,
    //     email,
    //     password,
    //     rol
    // }
    // console.log(user)
    // const result = await userMongo.addUser(user)

    // res.status(result.code).send({
    //     status: result.status,
    //     message: result.message
    // })

    res.send({status:"succes", message:"Usuario registrado"})

})

router.get('/failregister', async (req,res)=>{
    console.log('Fallo en el registro')
    res.send({error: 'Error en el registro'})
})

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async (req,res)=>{
    // const { email, password } = req.body
    // const user = await userMongo.veriLogin(email, password)

    // if(!user){
    //     return res.status(400).send({status:"error", error:"Datos incorrectos"})
    // }
  
    // req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age,
    //     rol: user.rol
    // }
    // res.send({status:"success", payload:req.res.user, message:"Primer logueo!!"})

    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});

    req.session.user = {
        firs_name : req.user.firs_name,
        last_name: req.user.last_name,
        email: req.user.email
    }


    res.send({status:"success", payload:req.user, message:"Primer logueo!!"})
})

router.get('/faillogin', async (req,res)=>{

    console.log('Fallo en el ingreso');
    res.send({error: 'Error en el ingreso'})

})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/')
    })
})

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req,res)=>{
    req.session.user =req.user
    res.redirect('/profile')
})


export default router