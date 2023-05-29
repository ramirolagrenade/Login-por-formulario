import { Router } from "express"
import UserMongo from '../Dao/mongoDb/loginMongo.js'

const router = Router()

const userMongo = new UserMongo()

router.post('/register', async (req,res) =>{
    let rol = 'Usuario'
    const {first_name, last_name, email, password} = req.body
    if(email==='adminCoder@coder.com' & password==='adminCod3r123'){
        rol = 'Administrador'
    }

    const user = {
        first_name,
        last_name,
        email,
        password,
        rol
    }
    console.log(user)
    const result = await userMongo.addUser(user)

    res.status(result.code).send({
        status: result.status,
        message: result.message
    })
})

router.post('/login', async (req,res)=>{
    const { email, password } = req.body
    const user = await userMongo.veriLogin(email, password)

    if(!user){
        return res.status(400).send({status:"error", error:"Datos incorrectos"})
    }
  
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
    }
    res.send({status:"success", payload:req.res.user, message:"Primer logueo!!"})
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/')
    })
})

export default router