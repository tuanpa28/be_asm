import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;
dotenv.config();

// connect database

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
