//IMPORTS
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import initializePassport from './config/passport-config.js';
import __dirname from './__dirname.js';
import sessionRouter from './routes/session.js';
import cartRouter from './routes/cart.js';
import productsRouter from './routes/products.js';
import upload from './utils/uploader.js';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ios from 'socket.io-express-session';
import { cartService, productService } from './services/services.js';
import { passportCall } from './utils/middlewares.js';
import { sendMail, sendSMS, sendWhatsapp } from './utils/mailing.js';

//EXPRESS
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
})
server.on('error', (error) => console.log(`Error en el servidor: ${error}`));

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(upload.single('thumbnail'));
export const io = new Server(server);
// io.use(ios(baseSession));

//ROUTER
app.use('/session', sessionRouter);
app.use('/api/carrito', cartRouter);
app.use('/api/productos', productsRouter);
app.get('/', (req, res) => {
    res.send(`<h1 style="color:green;font-family:Georgia, serif">Bienvenidos al servidor express de Stefi</h1>`);
})

//ENGINE
app.engine('handlebars', engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

io.on('connection', async socket => {
    console.log(`El socket ${socket.id} se ha conectado.`);
    let productos = await productService.getAll();
    socket.emit('updateProducts', productos);
})

//Usuario registrado
app.get('/session/currentUser', passportCall('jwt'), async(req, res) => {
    let user = req.user;
    res.send(user);
} )

//Logout
app.get('/session/logout', passportCall('jwt'), async(req, res) => {
    let user = req.user;
    res.send(user);
})

//Finalizacion de compra
app.get('/buyMail', passportCall('jwt'), async(req, res) => {
    let user = req.user;
    let productos = []
    let html = `<h1>Preparar pedido</h1>`;
    let cart = await cartService.getBy({_id:user.cart});
    for (let i = 0; i<cart.products.length; i++) {
        let product = await productService.getBy({_id:cart.products[i]});
        productos.push(product)
        html += `<p>${product.name}</p>
        <p>$${product.price}</p>`
    }
    sendMail(`Nuevo pedido de ${user.nombre} ${user.apellido}`, html);
    sendSMS(`Su pedido ha sido recibido`);
    sendWhatsapp(`${html}. De: ${user.nombre} ${user.apellido}`)
})