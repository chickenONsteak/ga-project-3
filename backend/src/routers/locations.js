import express from "express";
import { addLocation } from "../controllers/locations.js";
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

router.put("/", authAdmin, addLocation);

export default router;