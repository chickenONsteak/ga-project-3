import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addEvent,
  deleteEventById,
  getEventById,
  joinEvent,
  leaveEvent,
  removePetFromEvent,
  updateEvent,
} from "../controllers/events.js";

const router = express.Router();

router.get("/:eventId", getEventById); //accessible by public

router.use(auth);

router.post("/", addEvent);
router.put("/:eventId", joinEvent);
router.patch("/:eventId", updateEvent);
router.post("/:eventId", leaveEvent);
router.delete("/:eventId", deleteEventById);
router.delete("/:eventId/removePet", removePetFromEvent);

export default router;
