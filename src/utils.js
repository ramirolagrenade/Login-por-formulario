import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import { Faker,en } from '@faker-js/faker'
import { title } from 'process'
import path from 'path'
import jwt from 'jsonwebtoken'
import { options } from './config/options.js'

export const ___dirname = path.dirname(fileURLToPath(import.meta.url))

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)

export const customFaker = new Faker({
    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem} = customFaker

export const generateProduct = () => {

    return{
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        price: parseFloat(commerce.price()),
        description: lorem.lines(),
        stock: parseInt(string.numeric(2)),
        category: datatype.boolean() ? 'Terror' : 'Accion',
        thumbnail: image.url()
    }
}

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email},options.gmail.emailToken, {expiresIn:expireTime})
    return token
}

export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,options.gmail.emailToken);
        return info.email;
    } catch (error) {
        console.log(error.message)
        return null
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname