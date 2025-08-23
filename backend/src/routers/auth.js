import express from "express";
import { getAllUsers, login, refresh, register, promoteByUsername } from "../controllers/auth.js";
import { auth, authAdmin } from "../middleware/auth.js"; //admin permission required

const router = express.Router();

router.get("/", authAdmin, getAllUsers);
router.put("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.patch("/admin/promote", auth, authAdmin, promoteByUsername);

export default router;
