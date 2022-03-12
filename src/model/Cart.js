import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default class Cart {
    constructor(data) {
        this.data = data;
    }
    static get model() { 
        return 'carts'; 
    }
    static get schema(){
        return{
                products: [{
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                }],
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users',
                    unique: true
                },
            }
        }
    }