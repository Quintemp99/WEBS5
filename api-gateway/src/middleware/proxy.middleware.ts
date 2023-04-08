import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from "http-proxy-middleware";
import CircuitBreaker from 'opossum';
import { RequestHandler } from 'express';



const profileGet = async (req: any) =>{
  try{
    const token = jwt.sign({ user: req.user }, 
      process.env.API_SECRET || "", 
      { expiresIn: "1h"});
    const response = await fetch(`${process.env.PROFILESERVICE_URL}${req.originalUrl.replace("/profile","")}`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    return response
  }catch(err){
    console.log(err)
    throw Error(`ServiceUnavailable: ${err}`);
  }
}

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000 
};

const breaker = new CircuitBreaker(profileGet, options)

const profileProxyMiddleware:RequestHandler = async (req,res,next) =>{
  try{
    const response = await breaker.fire(req);
    const result = await response.json()

    res.status(response.status).json(result)
  }catch(err){
    console.log(`Something went wrong: ${err}`)
    next(err)
    return
  }
}

const authProxyMiddleware = createProxyMiddleware({
    target: process.env.AUTHSERVICE_URL || "",
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "",
    },
  });

  // const profileProxyMiddleware = createProxyMiddleware({
  //   target: process.env.PROFILESERVICE_URL || "",
  //   changeOrigin: true,
  //   onProxyReq: function onProxyReq(proxyReq, req, res){
  //     const token = jwt.sign({ user: req.user }, 
  //       process.env.API_SECRET || "", 
  //       { expiresIn: "1h"});
  //     proxyReq.setHeader('Authorization', `Bearer ${token}`)
  //   },
  //   pathRewrite: {
  //     "^/profile": "",
  //   },
  // });

  const targetProxyMiddleware = createProxyMiddleware({
    target: process.env.TARGETSERVICE_URL || "",
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res){
      const token = jwt.sign({ user: req.user }, 
        process.env.API_SECRET || "", 
        { expiresIn: "1h"});
      proxyReq.setHeader('Authorization', `Bearer ${token}`)
    },
    pathRewrite: {
      "^/target": "",
    },
  });

  export default {
    authProxyMiddleware,
    profileProxyMiddleware,
    targetProxyMiddleware
  }