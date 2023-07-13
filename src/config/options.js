import dotenv from 'dotenv'

dotenv.config()

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
        adminPass: process.env.ADMIN_PASS 
    },
}