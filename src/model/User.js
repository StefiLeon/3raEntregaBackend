import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default class User {
    constructor(data) {
        this.data = data;
    }
    static get model() { //getters: una fn que se convierte en prop
        return 'users'; //puedo acceder como si fuera una prop
    }
    static get schema(){
        return{
            email: {
                type: String,
                required: true,
                unique: true
            },
            nombre: {
                type: String,
                required: true
            },
            apellido: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            direccion: {
                type: String,
                required: true
            },
            edad: {
                type: Number,
                required: true
            },
            telefono: {
                type: Number,
                required: true
            },
            cart: {
                type:Schema.Types.ObjectId,
                ref:'carts'
            },
            avatar: String,
            role: String
        }
    }
}