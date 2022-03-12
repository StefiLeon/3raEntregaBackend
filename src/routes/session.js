import express from 'express';
import { passportCall, checkAuthorization } from '../utils/middlewares.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import upload from '../utils/uploader.js'
import { userService, cartService } from '../services/services.js';

const router = express.Router();

router.post('/register', passportCall('register'), (req, res) => {
    try {
        res.send({message:"Signed up."})
    } catch(err) {
        console.log(err);
        res.send({error:err})
    }
})

router.post('/login', passportCall('login'), (req, res) => {
    let user = req.user;
    let token = jwt.sign(user, config.jwt.SECRET);
    if(user) {
        res.cookie("JWT_COOKIE", token, {
            httpOnly: true,
            maxAge: 1000*60*60
        })
        res.send({status: 200, message:"Logueado."})
    } else {
        res.send({status: 401, error:'error'})
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('JWT_COOKIE');
    res.send({message:"Logged Out"})
})

router.get('/currentUser', passportCall('jwt'), checkAuthorization(["ADMIN", "USER"]), async(req, res) => {
    if(req.user) {
        let user = req.user;
        if(!user.cart) {
            let cart = await cartService.save({products: [], user:user._id});
            console.log(cart._id);
            user.cart = cart._id;
            let body = {
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                password: user.password,
                direccion: user.direccion,
                edad: user.edad, 
                telefono: user.telefono,
                role: user.role,
                avatar: user.avatar,
                cart: user.cart
            }
            await userService.update({_id:user._id}, body).then(result => {
                res.send(result);
            })
            return cart;
        }
        res.send(user);
    } else {
        console.log('err');
    }
})

router.get('/:cid', async(req, res) => {
    let id = req.params.cid;
    await userService.getBy({_id:id}).then(result => {
        res.send(result);
    })
})

export default router;