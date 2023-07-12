export class GetContactDto {
    constructor(contactDB){
        this.firts_name = contactDB.firts_name,
        this.last_name = contactDB.last_name,
        this.email = contactDB.email,
        this.cartId = contactDB.cartId
    }
}