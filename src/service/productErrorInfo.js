export const generateProductErrorInfo = (product) =>{
    return `
    Alguno de los campos para crear el Producto no es valido:
    Lista de campos requeridos:
    tiltle: Debe ser un campo string, pero recibio: ${product.tiltle}
    price: Debe ser un campo Number (Positivo), pero recibio: ${product.price}

    `
}