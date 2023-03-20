import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(cors());

app.listen(port, () => {
    console.log(`API gateway listening on port ${port}`);
  });