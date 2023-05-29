import fs from "fs"

export default class ProductManager{

    constructor(){
        this.path = './src/file/products.json'
    }
    

    getProducts = async () => {

        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            return products
        }
        else {
            return []
        }
    }

    validarDatos(productos) {
        if (productos.thumbnail === undefined) {
            productos.thumbnail = '???'
        }
        let verificacion = Object.values(productos)
        if (!verificacion.includes(undefined)) {
            if (productos.thumbnail === '???') {
                productos.thumbnail = undefined
            }
            return true
        }
        else {
            return false
        }
    }

    addProduct = async (newProduct) => {

        let products = await this.getProducts()

        let idProducto = products.length

        let productos = {
            title: newProduct.title,
            description: newProduct.description,
            code: newProduct.code,
            price: newProduct.price,
            status: true,
            stock: newProduct.stock,
            category: newProduct.category,
            thumbnail: newProduct.thumbnail,
            id: idProducto + 1
        }

        console.log(this.validarDatos(productos))
        if (this.validarDatos(productos)) {

            let producto_code = productos.code

            let producto = products.find(producto => producto.code === producto_code)

            if (!producto) {

                products.push(productos)

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))

                return true

            } else {
                console.log('Error, codigo repe')
                return false
            }

        }
        else {
            console.log('Error, Datos faltantes')
            return false
        }

    }

    deleteProduct = async (id) => {
        try {
            let products = await this.getProducts()
            let productIndex = products.findIndex(p => p.id == id)
            if (productIndex === -1) return false
            products.splice(productIndex, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            return true
        } catch (error) {
            return false
        }
    }

    updateProduct = async (IdProducto, data) => {
        try {
            let products = await this.getProducts()

            let productToUpdate = products.filter(producto => producto.id == IdProducto)
            let newProduct = productToUpdate[0]

            if (!productToUpdate.length) return false

            const keys = Object.keys(data)
            const values = Object.values(data)
            const newKeys = Object.keys(newProduct)

            for (let i = 0; i < keys.length; i++) {
                for(let j = 0; j < newKeys.length; j++){
                    if (newKeys[j] == keys[i]) {
                        newProduct[newKeys[j]] = values[i]
                    }
                }
            }

            products.splice(IdProducto-1 , 1, newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))

            return true

        } catch (error) {
            return false
        }
    }
}