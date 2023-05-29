import messageModel from '../models/messageModel.js'

export default class CartMongo {

    addMessage = async () => {

        const messages = await messageModel.create(newProduct)

        try {

            return {
                code: 202,
                status: 'Success',
                message: messages
            }

        } catch (error) {
            return {
                code: 400,
                status: 'Error',
                manssage: 'Mensaje no agregado'
            }
        }
    }

}