import userModel from '../models/userModel.js'

export default class ProductMongo {

    addUser = async(newUser) => {
        const user = await userModel.create(newUser)
        try {

            return {
                code: 202,
                status: 'Success',
                message: user
            }

        }
        catch (error) {
            return {
                code: 400,
                status: 'Error',
                manssage: 'Usuario no creado'
            }
        }
    }

    veriLogin = async (email, password)=>{
        const result = userModel.findOne({email,password})

        return result
    }
}