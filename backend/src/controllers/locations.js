import mongoose from "mongoose";
import AuthModel from "../models/Auth.js";
import LocationsModel from "../models/Locations.js";
import EventsModel from "../models/Events.js";

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

    const { name, address, region, capacity = null, image } = req.body || {};

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

    const isUrl =
      typeof image === "string" &&
      (image.startsWith("http://") || image.startsWith("https://")); //checks url format for image

    if (!isUrl) {
      return res.status(400).json({
        status: "error",
        msg: "Image must be a valid URL (http/https).",
      });
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
    // const outputArray = [];
    // for (const location of locations) {
    //   outputArray.push({
    //     _id: location._id,
    //     name: location.name,
    //     address: location.address,
    //     region: location.region,
    //     capacity: location.capacity,
    //     image: location.image,
    //   });
    // }
    // res.json(outputArray);
    res.json(locations);
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

    // fetch events hosted at this location
    const events = await EventsModel.find({ locationId })
      .select("title description startAt endAt hostUserId") // fetch only needed fields
      .populate({ path: "hostUserId", select: "username" })
      .lean();

    const hostedEvents = events.map((e) => ({
      //reshaping for wanted info only
      _id: e._id,
      title: e.title,
      description: e.description,
      startAt: e.startAt,
      endAt: e.endAt,
      hostUsername: e.hostUserId?.username ?? "(deleted user)",
    }));

    return res.json({ status: "ok", location, hostedEvents });
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

export const updateLocation = async (req, res) => {
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

    // extract inputs
    const { locationId, name, address, region, capacity, image } =
      req.body || {};

    // need locationId
    const idFromParam = req.params.locationId;
    const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!isValidId(idFromParam)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid locationId." });
    }
    // console.log("locationId from body:", locationId);

    if (req.body?.locationId && req.body.locationId !== idFromParam) {
      return res.status(400).json({
        status: "error",
        msg: "locationId in URL and body do not match.",
      });
    }

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (address !== undefined) update.address = String(address).trim();

    if (region !== undefined) {
      const allowedRegions = ["north", "south", "east", "west"];
      if (!allowedRegions.includes(region)) {
        return res
          .status(400)
          .json({ status: "error", msg: "Invalid region." });
      }
      update.region = region;
    }

    if (capacity !== undefined) {
      if (capacity !== null && (isNaN(capacity) || Number(capacity) < 1)) {
        return res.status(400).json({
          status: "error",
          msg: "Capacity must be a positive number or null.",
        });
      }
      update.capacity = capacity ?? null;
    }

    if (image !== undefined) {
      const isUrl =
        typeof image === "string" &&
        (image.startsWith("http://") || image.startsWith("https://"));
      if (!isUrl) {
        return res
          .status(400)
          .json({ status: "error", msg: "Image must be a valid URL." });
      }
      update.image = image.trim();
    }

    if (Object.keys(update).length === 0) {
      //nothing in body
      return res
        .status(400)
        .json({ status: "error", msg: "No fields provided to update." });
    }

    const updatedLocation = await LocationsModel.findByIdAndUpdate(
      locationId,
      { $set: update },
      { new: true } // return updated doc
    );

    if (!updatedLocation) {
      return res
        .status(404)
        .json({ status: "error", msg: "Location not found." });
    }

    return res.status(200).json({ status: "ok", updatedLocation });
  } catch (e) {
    console.error(e.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error updating location" });
  }
};
