import * as dotenv from 'dotenv'
import  {__dirname}  from "../utils.js"
import path from "path"
import { Command } from 'commander'

const program = new Command()

program
.option("-mode <modo>", "Modo de Inicio", "dev")
program.parse()

const environment = program.opts()

console.log(environment)

const pathEnvironment = environment.Mode === "prod" ? path.join(__dirname, "../.env.production") : path.join(__dirname, "../.env.development")

dotenv.config({path: pathEnvironment})

export const options = {
    fileSystem: {
        usersFileName: 'users.json',
        productsFileName: 'products.json',
    },
    mongoDB: {
        url: process.env.MONGO_URL
    },
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION
    },
    gitHub: {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callBackUrl: process.env.CALLBACKURL
    },
    gmail: {
        adminAccount: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASS,
        emailToken: process.env.SECRET_TOKEM_EMAIL
    },
}