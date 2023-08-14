import { Router } from "express"
import UserMongo from '../Dao/mongoDb/loginMongo.js'
import { createHash, validatePassword, generateEmailToken, verifyEmailToken} from '../utils.js'
import passport from 'passport'
import {checkRole} from '../middlewares/auth.js'
import userModel from "../Dao/models/userModel.js"
import {sendRecoveryPass} from "../utils/email.js"

const router = Router()

const userMongo = new UserMongo()

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req,res) =>{
    res.send({status:"succes", message:"Usuario registrado"})

})

router.get('/failregister', async (req,res)=>{
    console.log('Fallo en el registro')
    res.send({error: 'Error en el registro'})
})

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async (req,res)=>{

    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'})

    req.session.user = {
        firs_name : req.user.firs_name,
        last_name: req.user.last_name,
        email: req.user.email
    }


    res.send({status:"success", payload:req.user, message:"Primer logueo!!"})
})

router.get('/faillogin', async (req,res)=>{

    console.log('Fallo en el ingreso')
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

router.get('/current', async (req,res)=>{
    
})

router.put("/premium/:uid", checkRole(['admin']),async(req,res)=>{
    try{
        const userId = req.params.uid
        const user = await userModel.findById(userId)
        const userRol = user.rol
        if(userRol === 'user'){
            user.rol = "premium"
        }else if( userRol === 'premium'){
            user.rol = "user"
        }else{
            return res.json({status:"error", message: "No es posible cambiar el rol del usuario."})
        }
        await userModel.updateOne({_id:user._id},user)
        res.send({status:"success", message:"rol modificado"})
    }catch(error){
        return res.json({status:"error", message: "Hubo un error al cambiar el rol del usuario."})
    }
})

router.post("/forgot-password",async (req,res)=>{
    try {
        const { email } = req.body
        const user = await userModel.findOne({email:email})

        if(!user){
            return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)
        }
        const token = generateEmailToken(email,3*60)
        await sendRecoveryPass(email,token)
        res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver  <a href='/login'>al login</a>")
    } catch (error) {
        return res.send(`<div>Error, <a href="/forgot-password">Intente de nuevo</a></div>`)

    }
})

router.post("/reset-password", async (req,res)=>{
    try {
           const token = req.query.token
           const {email,newPassword} = req.body

           const validEmail = verifyEmailToken(token) 
           if(!validEmail){
            return res.send(`El enlace ya no es valido, genere uno nuevo: <a href="/forgot-password">Nuevo enlace</a>.`)
           }
           const user = await userModel.findOne({email:email})
           if(!user){
            return res.send("El usuario no esta registrado.")
           }
           if(validatePassword(newPassword,user)){
            return res.send("No puedes usar la misma contraseña.")
           }
           const userData = {
            ...user._doc,
            password:createHash(newPassword)
           }
           const userUpdate = await userModel.findOneAndUpdate({email:email},userData)
           res.render("login",{message:"contraseña actualizada"})

    } catch (error) {
        res.send(error.message)
    }
})

export default router