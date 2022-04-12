import passport from "passport";
import local from 'passport-local';
import { userService } from '../services/services.js';
import { createHash, isValidPassword, cookieExtractor } from '../utils/utils.js';
import config from './config.js';
import jwt from 'passport-jwt';
import { sendMail } from '../utils/mailing.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:"email", session:false}, async(req, username, password, done) => {
        let { email, nombre, apellido, direccion, edad, telefono } = req.body;
        try {
            if(!req.file) return done(null, false, {message:`No se pudo subir el avatar.`})
            let user = await userService.getBy({email:email});
            if(user) return done(null, false, {message:"Ya existe un usuario registrado con este email."});
            const newUser = {
                email,
                nombre,
                apellido,
                password: createHash(password),
                direccion,
                edad, 
                telefono,
                role: 'user',
                avatar: req.file.filename || req.avatar
            }
            let result = await userService.save(newUser);
            sendMail('Nuevo registro', `<h1>Registro de ${newUser.nombre}</h1>
            <p>Se ha registrado exitosamente a ${newUser.nombre} ${newUser.apellido} con el mail ${newUser.email}
            </p>`)
            return done(null, result, {newUser:newUser});
        } catch(err) {
            console.log(err);
            return done(err);
        }
    }))
    passport.use('login', new LocalStrategy({usernameField:"email"}, async(username, password, done) => {
        try {
            if(username === config.session.ADMIN && password === config.session.PASSWORD) {
                return done(null, {id:0, role:"admin"})
            }
            const user = await userService.getBy({email:username});
            if(user === null) {
                result.status = 500;
                return done(null, false, {message: "No se encontró el usuario."});
            }
            if(!isValidPassword(user, password)) {
                result.status = 401;
                console.log('Contraseña incorrecta')
                return done(null, false, {message:"Contraseña incorrecta."})
            }
            return done(null, user, {status: 200});
        } catch(err) {
            return done(err);
        }
    }))
    passport.use('jwt', new JWTStrategy({jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), secretOrKey: config.jwt.SECRET}, async(jwt_payload, done) => {
        try {
            if(jwt_payload.role === "admin") return done(null, jwt_payload);
            let user = await userService.getBy({_id:jwt_payload._id});
            if(!user) return done(null, false, {message: "Usuario no encontrado."});
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async(id, done) => {
        let result = await userService.getBy({_id:id})
        done(null, result);
    })
}

export default initializePassport;