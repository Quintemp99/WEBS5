import passport from "passport";
import passportJWT from "passport-jwt";

passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) =>{
    return done(null, jwtPayload.user)
}))

export const passportMiddleware = passport.authenticate("jwt", {session: false})