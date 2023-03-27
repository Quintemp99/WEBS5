import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/routes";
import connect from "./connect";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || '';
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () =>
  console.log(`Auth service started successfully on port ${port}.`)
);
const db = process.env.MONGO_URL || '';

connect({ db });
require('./initialize/auth')
routes({ app });
