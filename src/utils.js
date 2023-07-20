import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import { Faker,en } from '@faker-js/faker'
import { title } from 'process'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)

export const customFaker = new Faker({
    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem} = customFaker

export const generateProduct = () => {

    return{
        _id: DatabaseModule.mongodbObjectId(),
        title: commerce.productName(),
        price: parseFloat(commerce.department()),
        description: lorem.lines(),
        stock: parseInt(string.numeric(2)),
        category: datatype.boolean() ? 'Terror' : 'Accion',
        thumbnail: image.url()
    }

}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname