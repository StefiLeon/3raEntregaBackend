import { Router } from 'express';
import { cartService, productService, userService } from '../services/services.js';

const router = Router();

//GETS
//Obtener productos de un carrito
router.get('/:cid', async(req, res) => {
    let id = req.params.cid;
    let order = await cartService.getBy({_id:id});
    if(!order) {
        throw new Error (`No cart.`);
    }
    console.log(order);
    res.send(order);
})

//Obtener todos los carritos
router.get('/', async (req, res) => {
    let carts = await cartService.getAll();
    if(!carts) throw new Error (`No carts.`);
    console.log(carts);
    res.send(carts);
})

//POSTS
//Crear carrito
router.post('/:pid', async(req, res) => {
    let id = req.params.pid;
    let user = await userService.getBy({_id:id});
    if (!user) throw new Error('User not found.')
    if(user.cart) {
        throw new Error ('Cart already created.')
    }
})

//Agregar producto al carrito
router.post('/:cid/:pid', async(req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    
    let producto = await productService.getBy({_id:pid}).then(result => {
        return result;
    })
    if(!producto) throw new Error('Non-existent product.')
    
    let cart = await cartService.getBy({_id:cid}).then(result => {
        return result;
    })
    if(!cart) throw new Error('Non-existent cart.')
        
    if(cart.products.includes({_id:pid})) throw new Error ('Product already in cart.')

    cart.products.push(pid);

    await cartService.update({_id:cid}, {products:cart.products}).then(result => {
        console.log(cart.products);
        res.send({message:'success', result:result});
    })
})

//DELETES
//Borrar carrito
router.delete('/:cid', async(req, res) => {
    let id =req.params.cid;
    await cartService.delete({_id:id}).then(result => {
        res.send({message:'success', result:result});
    })
})



export default router;