import express from "express";
import { auth } from "../middleware/auth.js";
import { addPet, deleteOnePet, updateOnePet, viewOwnedPets } from "../controllers/pets.js";

const router = express.Router();

//all routes require login
router.use(auth);

router.post("/me", addPet)
router.get("/me", viewOwnedPets)
router.patch("/:id", updateOnePet)
router.delete("/:id", deleteOnePet)

export default router;