import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import { getMyProfile, getPublicProfile, updateMyProfile } from "../controllers/profiles.js";

const router = express.Router();

router.get("/me", auth, getMyProfile);
router.patch("/me", auth, updateMyProfile);
router.get("/:id", auth, getPublicProfile); //logged in users can view other users profile

export default router;
