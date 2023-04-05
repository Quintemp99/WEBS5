import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/routes";
import connect from "./config/connect";
import cors from "cors";
import promBundle from "express-prom-bundle";
import { enableAuthConsumer, enableTargetConsumer } from "./services/consumer.service";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || '';
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
  console.log(`Profile service started successfully on port ${port}.`)
);
const db = process.env.MONGO_URL || '';

connect({ db });
routes({ app });
enableAuthConsumer();
enableTargetConsumer();
