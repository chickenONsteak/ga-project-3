import express from "express";
import { connectDB } from "./src/db/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMS: 15 * 60 * 1000, //15min
  max: 100, //100calls
  standardHeaders: true, //client read limits
  legacyHeaders: false, //dont send xratelimit
});

connectDB();

const app = express();

app.use(cors()); //allow cross origin req
app.use(helmet()); //add common security
app.use(limiter); //apply rate

app.use(express.json()); //Parse json into body
app.use(express.urlencoded({ extended: false })); //use simple objects only

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
