import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import promBundle from "express-prom-bundle";

import proxyMiddleware from "./middleware/proxy.middleware";
import {passportMiddleware} from "./middleware/auth.middleware"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const metricsMiddleware = promBundle({
  includePath: true,
  includeStatusCode: true,
  promClient:{
    collectDefaultMetrics:{}
  }
})

app.use(morgan("dev"));
app.use(cors());

app.use(metricsMiddleware)

app.use("/auth", proxyMiddleware.authProxyMiddleware)

app.use("/profile", passportMiddleware, proxyMiddleware.profileProxyMiddleware)

app.use("/target", passportMiddleware, proxyMiddleware.targetProxyMiddleware)

app.get("/validate", passportMiddleware, (req,res)=>{
  res.status(200);
  res.end();
})

app.listen(port, () => {
  console.log(`API gateway listening on port ${port}`);
});