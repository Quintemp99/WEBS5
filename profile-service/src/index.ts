import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/routes";
import connect from "./config/connect";
import { enableConsumer } from "./services/consumer.service";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || '';
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () =>
  console.log(`Profile service started successfully on port ${port}.`)
);
const db = process.env.MONGO_URL || '';

connect({ db });
routes({ app });
enableConsumer();
