import mongoose from "mongoose";
import User from './User.js';
import Cart from './Cart.js';
import Product from './Product.js';

export default class Dao {
    constructor(config) {
        this.mongoose = mongoose.connect(config.url, {useNewUrlParser:true}).catch(error => {
            console.log(error);
            process.exit();
        })
        const timestamp = {timestamps: {createdAt:'created_at', updatedAt:'updated_at'}};
        const userSchema = mongoose.Schema(User.schema, timestamp);
        userSchema.pre('find', function(){
            this.populate('cart')
        })
        const cartSchema = mongoose.Schema(Cart.schema, timestamp);
        cartSchema.pre('find', function(){
            this.populate('products', 'user')
        })
        const productSchema = mongoose.Schema(Product.schema, timestamp);

        this.models = {
            [User.model]:mongoose.model(User.model, userSchema),
            [Cart.model]:mongoose.model(Cart.model, cartSchema),
            [Product.model]:mongoose.model(Product.model, productSchema)
        }
    }
    //Operaciones CRUD
    findOne = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let result = await this.models[entity].findOne(options);
        return result ? result.toObject() : null;
    }
    getAll = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let results = await this.models[entity].find(options);
        if(!results) throw new Error(`Results not found.`)
        return results.map(result => result.toObject())
    }
    insert = async(document, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        try {
            let instance = new this.models[entity](document);
            let result = await instance.save();
            return result ? result.toObject() : null;
        } catch(err) {
            console.log(err);
            return null;
        }
    }
    update = async(document, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let id = document._id;
        delete document._id;
        let result = await this.models[entity].findByIdAndUpdate(id, {$set:document}, {new:true});
        return result.toObject();
    }
    deleteOne = async(id, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let result = await this.models[entity].findByIdAndDelete(id);
        return result ? result.toObject() : null;
    }
    exists = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        return this.models[entity].exists(options);
    }
}