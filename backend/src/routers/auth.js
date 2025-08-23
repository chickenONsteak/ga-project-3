import express from "express";
import { getAllUsers, login, refresh, register } from "../controllers/auth.js";
import { authAdmin } from "../middleware/auth.js"; //admin permission required

const router = express.Router();

router.get("/", authAdmin, getAllUsers);
router.put("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
