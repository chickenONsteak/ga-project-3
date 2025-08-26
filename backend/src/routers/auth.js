import express from "express";
import {
  getAllUsers,
  login,
  refresh,
  register,
  promoteByUsername,
} from "../controllers/auth.js";
import { auth, authAdmin } from "../middleware/auth.js"; //admin permission required
import {
  validateLoginData,
  validateRegistrationData,
} from "../validators/auth.js";
import checkError from "../validators/checkErrors.js";

const router = express.Router();

router.get("/", authAdmin, getAllUsers); 
router.put("/register", validateRegistrationData, checkError, register);
router.post("/login", validateLoginData, checkError, login);
router.post("/refresh", refresh);
router.patch("/admin/promote", auth, authAdmin, promoteByUsername);

export default router;
