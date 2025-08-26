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

    const { name, address, region, capacity, image = null } = req.body || {};

    if (!name || !address || !image) {
      return res
        .status(400)
        .json({ status: "error", msg: "Missing required fields." });
    }

    // validate region
    const allowedRegions = ["north", "south", "east", "west"];
    if (region && !allowedRegions.includes(region)) {
      //only accept above options
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid region value." });
    }

    // validate capacity
    if (capacity !== null && (isNaN(capacity) || Number(capacity) < 1)) {
      // if not null check> Nan/ 0 = reject
      return res
        .status(400)
        .json({ status: "error", msg: "Capacity must be a positive number." });
    }

    const payload = {
      name: String(name).trim(),
      address: String(address).trim(),
      region: region || undefined, //no fill
      capacity: capacity || null, //show fill with no value
      image: String(image).trim(),
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

export const viewAllLocations = async (req, res) => {
  try {
    // const locations = await LocationsModel.find(undefined, { __v: 0 });
    const locations = await LocationsModel.find();
    const outputArray = [];
    for (const location of locations) {
      outputArray.push({
        _id: location._id,
        name: location.name,
        address: location.address,
        region: location.region,
        capacity: location.capacity,
        image: location.image,
      });
    }
    res.json(outputArray);
    // res.json(locations);
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Unable to fetch locations" });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { locationId } = req.params; //get id from route
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid locationId." });
    }
    const location = await LocationsModel.findById(locationId);

    if (!location) {
      return res
        .status(404)
        .json({ status: "error", msg: "Location not found." });
    }

    return res.json({ status: "ok", location });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Unable to fetch location" });
  }
};

export const removeLocation = async (req, res) => {
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

    const { locationId } = req.params; //get id from route
    const isValidId = (x) => mongoose.Types.ObjectId.isValid(x);
    if (!isValidId(locationId)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid location id" });
    }

    const deleted = await LocationsModel.findOneAndDelete({
      _id: locationId,
    });

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        msg: "Location not found or you are not the admin.",
      });
    }

    return res.json({ status: "ok", msg: "Location deleted successfully." });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({
      status: "error",
      msg: "Failed to delete location",
    });
  }
};
