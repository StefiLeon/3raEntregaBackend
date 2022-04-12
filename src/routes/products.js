import { Router } from 'express';
import { productService } from '../services/services.js';
import __dirname from '../__dirname.js';

const router = Router();

//GETS
//Obtener todos los productos
router.get('/', async(req, res) => {
    let products = await productService.getAll();
    if(!products) throw new Error;
    res.send(products);
})

//Obtener producto por id
router.get('/:pid', async(req, res) => {
    let id = req.params.pid;
    await productService.getBy({_id:id}).then(result => {
        res.send(result);
    })
})

//POSTS
//Agregar producto al sistema
router.post('/', async (req, res) => {
    let file = req.file;
    let producto = req.body;
    console.log(producto);
    if(file){
        producto.thumbnail = __dirname+`/images/${file.filename}`;
    }
    await productService.save(producto).then(result => {
        res.send(producto);
        // if(producto) {
        //     productService.getAll().then(result => {
        //         io.emit('updateProducts', result);
        //         console.log(producto.id)
        //     })
        // }
    })
})

//PUTS
//Actualizar produto por ID
router.put('/:pid', async (req, res) => {
    let body = req.body;
    let id = req.params.pid;
    await productService.update({_id:id}, body).then(result => {
        res.send(result);
    })
})

//DELETES
//Borrar producto por ID
router.delete('/:pid', async (req, res) => {
    let id = req.params.pid;
    await productService.delete({_id:id}).then(result => {
        res.send({message:'success', result:result});
    })
})

export default router;