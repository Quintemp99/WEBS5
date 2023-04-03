import { createProxyMiddleware } from "http-proxy-middleware";

const authProxyMiddleware = createProxyMiddleware({
    target: process.env.AUTHSERVICE_URL || "",
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "",
    },
  });

  export default {
    authProxyMiddleware
  }