import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import { getMyProfile, updateMyProfile } from "../controllers/profiles.js";

const router = express.Router();

router.get("/me", auth, getMyProfile);
router.patch("/me", auth, updateMyProfile);

export default router;
