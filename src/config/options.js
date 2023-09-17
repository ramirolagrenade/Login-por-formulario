import * as dotenv from 'dotenv' 
import { fileURLToPath } from 'url' 
import path from 'path'  // Importa la función dirname de path
import { Command } from 'commander' 
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

const program = new Command() 

program
  .option("-mode <modo>", "Modo de Inicio", "dev")
  .parse() 

const environment = program.opts() 

// Define la ruta del archivo .env según el entorno
const envFileName = environment.mode === "prod" ? "../../.env.production" : "../../.env.development" 
const pathEnvironment = path.join(__dirname, envFileName) 

// console.log(pathEnvironment)

dotenv.config({ path: pathEnvironment }) 

console.log(environment) 

console.log("Ruta del archivo .env:", pathEnvironment) 

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
