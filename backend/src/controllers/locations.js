import mongoose from "mongoose";
import AuthModel from "../models/Auth.js";
import LocationsModel from "../models/Locations.js";

export const addLocation = async (req, res) => {
  try {
    // get logged in username
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim();
    if (!username) {
      return res.status(401).json({ status: "error", msg: "Unauthorised" });
    }

    // check user exists
    const user = await AuthModel.findOne({ username }).select("role _id");
    if (!user) {
      return res.status(401).json({ status: "error", msg: "Unauthorised" });
    }

    // ensure admin only access
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", msg: "Only admins can create locations." });
    }

    const { name, address, region, capacity = null } = req.body || {};

    if (!name || !address) {
      return res
        .status(400)
        .json({ status: "error", msg: "Missing required fields." });
    }

    // validate region
    const allowedRegions = ["north", "south", "east", "west"];
    if (region && !allowedRegions.includes(region)) { //only accept above options
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid region value." });
    }

    // validate capacity
    if (capacity !== null && (isNaN(capacity) || Number(capacity) < 1)) { // if not null check> Nan/ 0 = reject
      return res
        .status(400)
        .json({ status: "error", msg: "Capacity must be a positive number." });
    }

    const payload = {
      name: String(name).trim(),
      address: String(address).trim(),
      region: region || undefined, //no fill
      capacity: capacity || null, //show fill with no value
    };

    const createdLocation = await LocationsModel.create(payload);

    return res.status(201).json({ status: "ok", createdLocation });
  } catch (e) {
    console.error(e.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error creating location." });
  }
};
