import passport from "passport"
import local from 'passport-local'
import userService from '../Dao/models/userModel.js'/////////
import UserMongo from "../Dao/mongoDb/loginMongo.js"
import { createHash, validatePassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import { options } from '../config/options.js'

const LocalStrategy = local.Strategy

const userMongo = new UserMongo()

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { first_name, last_name ,age , email, carts } = req.body
         
            try {
                const user = await userMongo.findOne(username);

                if(user){
                    console.log('El usuario existe')
                    return done(null,false)
                }
                let rol = 'user'
                const newUser = {
                    first_name, 
                    last_name, 
                    age,
                    email,
                    carts, 
                    password: createHash(password),
                    rol
                }

                const result = await userMongo.addUser(newUser)
                console.log(result);
                return done(null, result.manssage)

            } catch (error) {
                return done("Error al registrar el usuario: " + error)
            }
        }
    ))

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done)=>{
        const user = await userMongo.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{

        try {
           
           const user = await userMongo.findOne(username)
            if(!user){
                console.log('No existe el usuario')
                return done(null, false)
            }
            if(!validatePassword(password,user)) return done (null, false)
            return done(null,user)

        } catch (error) {
            
            return done("Error al intentar ingresar: " + error)
            
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID: options.gitHub.clientID,
        clientSecret: options.gitHub.clientSecret,
        callbackURL: options.gitHub.callBackUrl
    }, async (accesToken, refreshToken, profile,done)=>{
        try {
            let email = profile._json.email 

            if(!email){
                email = profile._json.login 
            }

            let user = await userMongo.findOne(email)

            if(!user){
                const newUser = {
                    first_name: profile._json.name, 
                    last_name: '',
                    email: email, 
                    age: 18,
                    password: ''
                }
                const result = await userMongo.addUser(newUser) 
                done(null,result) 
            } 
        } catch (error) {
            return done(null, error)
        }
    }))


}

export default initializePassport