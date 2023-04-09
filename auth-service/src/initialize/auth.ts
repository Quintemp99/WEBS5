import passport from 'passport';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const localStrategy = require('passport-local').Strategy
import userModel from '../models/user.model';
import passportJWT from "passport-jwt";
import { publishUser } from '../services/publisher.service';

import dotenv from "dotenv";

dotenv.config();

passport.use(
    new passportJWT.Strategy(
      {
        secretOrKey: process.env.JWT_SECRET || "",
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (tokenPayload, done) => {
        try {
          return done(null, tokenPayload.user);
        } catch (error) {
          done(error);
        }
      }
    )
);

passport.use(
    'register',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email:string, password:string, done:any) => {
        try {
          const adminWhiteList = ["quin@gmail.com"]
          const roles = ["gebruiker"]
          if(adminWhiteList.includes(email)){
            roles.push("admin")
          }
          const user = await userModel.create({ email:email, password:password, roles: roles });
          await publishUser({_id: user._id.toString(), email: user.email, roles: user.roles});
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email:string, password:string, done:any) => {
        try {
          const user = await userModel.findOne({ email });
          if (user === null) {
            return done(null, false, { message: 'User not found' });
          }
          
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );