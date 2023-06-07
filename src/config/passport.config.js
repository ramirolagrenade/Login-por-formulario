import passport from "passport"
import local from 'passport-local'
import userService from '../Dao/models/userModel.js'/////////
import UserMongo from "../Dao/mongoDb/loginMongo.js"
import { createHash, validatePassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const userMongo = new UserMongo()

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { first_name, last_name ,age , email } = req.body
            try {
                const user = await userMongo.findOne(username)
                if(user){
                    console.log('El usuario existe')
                    return done(null,false)
                }
                const newUser = {
                    first_name, 
                    last_name, 
                    age,
                    email, 
                    password: createHash(password)
                }

                const result = await userMongo.addUser(newUser)
                return done(null, result)

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
        clientID:'Iv1.43013858f37c01f1',
        clientSecret:'977ca2b9824bb370966309c2ffbe32c562d88502',
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    }, async (accesToken, refreshToken, profile,done)=>{
        try {
            let email = profile._json.email 

            if(!email){
                email = profile._json.login 
            }

            let user = await UserMongo.findOne(email)

            if(!user){
                const newUser = {
                    first_name: profile._json.name, 
                    last_name: '',
                    email: email, 
                    age: 18,
                    password: ''
                }
                const result = await UserMongo.addUser(newUser) 
                done(null,result) 
            } 
        } catch (error) {
            return done(null, error)
        }
    }))


}

export default initializePassport