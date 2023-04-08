import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from "http-proxy-middleware";

const authProxyMiddleware = createProxyMiddleware({
    target: process.env.AUTHSERVICE_URL || "",
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "",
    },
  });

  const profileProxyMiddleware = createProxyMiddleware({
    target: process.env.PROFILESERVICE_URL || "",
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res){
      const token = jwt.sign({ user: req.user }, 
        process.env.API_SECRET || "", 
        { expiresIn: "1h"});
      proxyReq.setHeader('Authorization', `Bearer ${token}`)
    },
    pathRewrite: {
      "^/profile": "",
    },
  });

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