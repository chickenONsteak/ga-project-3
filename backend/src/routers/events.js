import express from "express";
import { auth } from "../middleware/auth.js";
import { addEvent, joinEvent } from "../controllers/events.js";

const router = express.Router();

router.use(auth);

router.post("/", addEvent)
router.put("/:eventId", joinEvent)

export default router;