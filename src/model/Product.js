import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default class Product {
    constructor(data) {
        this.data = data;
    }
    static get model() { 
        return 'products';
    }
    static get schema(){
        return{
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            code: {
                type: Number,
                required: true,
                unique: true
            }, 
            price: {
                type: Number,
                required: true
            },
            stock: {
                type: Number,
                required: true
            },
            thumbnail: {
                type: String,
                required: true
            }
        }
    }
}