import passport from "passport";

export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            console.log(user);
            if(err) {
                return next(err);
            }
            if(!user) {
                return res.send({error:info.message ? info.message : info.toString()});
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const checkAuthorization = (roles) => {
    return async(req, res, next) => {
        if(!req.user) return res.send({error:"No authorizado."});
        if(roles.includes(req.user.role.toUpperCase())) next();
        else res.status(403).send({error:"Acceso no autorizado a este usuario."})
    }
}