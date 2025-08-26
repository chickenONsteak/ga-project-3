import express from "express";
import {
  addLocation,
  getLocationById,
  removeLocation,
  updateLocation,
  viewAllLocations,
} from "../controllers/locations.js";
import { auth, authAdmin } from "../middleware/auth.js";

const router = express.Router();

//accessible to public
router.get("/", viewAllLocations);
router.get("/:locationId", getLocationById);

router.use(auth);

router.put("/", authAdmin, addLocation);
router.delete("/:locationId", authAdmin, removeLocation);
router.patch("/:locationId", authAdmin, updateLocation)

export default router;
