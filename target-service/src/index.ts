import express, { Request, Response, Application } from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/routes";
import connect from "./connect";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || "3001";
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.listen(port, () =>
  console.log(`Target service started successfully on port ${port}.`)
);
routes({ app });
