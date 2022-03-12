import Cart from "../model/Cart.js";
import GenericQueries from "./genericQueries.js";

export default class CartService extends GenericQueries {
    constructor(dao) {
        super(dao, Cart.model);
    }
}