import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/routes";
import connect from "./connect";
import promBundle from "express-prom-bundle";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || "";

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () =>
  console.log(`Auth service started successfully on port ${port}.`)
);
const db = process.env.MONGO_URL || "";

connect({ db });
require('./initialize/auth')
routes({ app });
