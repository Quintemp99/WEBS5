import passport from "passport";
import passportJWT from "passport-jwt";
import { Request, Response } from "express";
import { TUser } from "../types/profile.type";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ConnectRoles = require("connect-roles");

passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.API_SECRET
}, (jwtPayload, done) =>{
    return done(null, jwtPayload.user)
}))

const roles = new ConnectRoles({
    failureHandler: function (req: Request, res: Response, action: any) {
        res.status(403);
        res.send("Access Denied - You don't have permission to: " + action);
      },
})

roles.use("gebruiker", function(req: Request){
    const user = req.user as TUser
    if(user.roles.includes("gebruiker")){
        return true
    }
})

const passportMiddleware = passport.authenticate("jwt", {session: false})

export default {roles, passportMiddleware}

