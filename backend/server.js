import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./src/db/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./src/routers/auth.js";
import petsRouter from "./src/routers/pets.js";
import profileRouter from "./src/routers/profile.js";
import eventsRouter from "./src/routers/events.js";
import locationsRouter from "./src/routers/locations.js";

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

//error handler for invalid body req format
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    //broken JSON body
    console.error("JSON parsing error:", err.message);
    return res
      .status(400)
      .json({ status: "error", msg: "invalid JSON format" });
  } else if (
    //broken form data
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    console.error("URL-encoded parsing error:", err.message);
    return res
      .status(400)
      .json({ status: 400, msg: "invalid form data format" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/pets", petsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/events", eventsRouter);
app.use("/api/locations", locationsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
