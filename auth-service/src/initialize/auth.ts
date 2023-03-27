import passport from 'passport';
const localStrategy = require('passport-local').Strategy
import userModel from '../models/user.model';
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

import dotenv from "dotenv";

dotenv.config();

passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.JWT_SECRET || "",
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
      },
      async (token:any, done:any) => {
        try {
          return done(null, token.user);
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
          const user = await userModel.create({ email, password });
  
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
  
          if (!user) {
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