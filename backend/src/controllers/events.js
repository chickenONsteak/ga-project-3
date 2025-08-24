import mongoose from "mongoose";
import EventsModel from "../models/Events.js";
import AuthModel from "../models/Auth.js";
import PetsModel from "../models/Pets.js";

export const addEvent = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const host = await AuthModel.findOne({ username }).select("_id"); //find host id
    if (!host)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const {
      title,
      description = "",
      locationId,
      startAt,
      endAt,
      status = "scheduled",
      attendeesUsers = [],
      attendeesPets = [],
    } = req.body || {};

    if (!title || !locationId || !startAt || !endAt) {
      //required fills
      return res
        .status(400)
        .json({ status: "error", msg: "Missing required fields." });
    }

    //ensure location exists (require to change after creating location)
    const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!isValidId(locationId)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid locationId." });
    }

    // Ensure location exists
    // const locationExists = await LocationsModel.findById(locationId).select("_id");
    // if (!locationExists) {
    //   return res
    //     .status(404)
    //     .json({ status: "error", msg: "Location not found." });
    // }

    //converts HTML date into Date object ("2025-09-01T14:00" - no seconds here)
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      //converts date & time into ms
      return res.status(400).json({ status: "error", msg: "Invalid dates." });
    }
    if (end <= start) {
      return res
        .status(400)
        .json({ status: "error", msg: "endAt must be after startAt." });
    }

    //ensure no random invalidated inputs allowed
    const cleanIdArray = (arr) => [
      ...new Set(arr.filter((id) => typeof id === "string" && isValidId(id))), // remove duplicate, filter invalid object, send back as array
    ];

    const payload = {
      title: String(title).trim(),
      description: String(description),
      locationId,
      hostUserId: host._id,
      startAt: start,
      endAt: end,
      attendeesUsers: cleanIdArray(attendeesUsers),
      attendeesPets: cleanIdArray(attendeesPets),
      status,
    };

    const createdEvent = await EventsModel.create(payload);
    return res.status(201).json({ status: "ok", createdEvent });
  } catch (e) {
    console.error(e.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error creating event." });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username) {
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    //search current user intending to join event (logged in user)
    const user = await AuthModel.findOne({ username }).select("_id");
    if (!user) {
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    const { eventId } = req.params; //grab id from params
    const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!isValidId(eventId)) {
      return res.status(400).json({ status: "error", msg: "Invalid eventId." });
    }

    const { petIds = [] } = req.body || {}; //user able to select pets (or bring no pets)

    //ensure no random invalidated inputs allowed
    const cleanIdArray = (arr) => [
      ...new Set(arr.filter((id) => typeof id === "string" && isValidId(id))), // remove duplicate, filter invalid object, send back as array
    ];

    const cleanedPetIds = cleanIdArray(petIds);

    let ownedPetIds = [];
    if (cleanedPetIds.length > 0) {
      const ownedPets = await PetsModel.find({
        //match both conditions
        _id: { $in: cleanedPetIds }, //for all/each items match with ownerid
        ownerId: user._id,
      }).select("_id");
      ownedPetIds = ownedPets.map((p) => p._id.toString()); //string for consistency
    }

    const update = {
      $addToSet: { attendeesUsers: user._id }, //prevents duplicate & always add user
    };
    if (ownedPetIds.length > 0) {
      //update only if pet is selected
      update.$addToSet.attendeesPets = { $each: ownedPetIds }; //for each id, apply addtoset
    }

    // add user only if not already inside
    const updatedEvent = await EventsModel.findByIdAndUpdate(eventId, update, {
      new: true,
    })
      .populate("attendeesUsers", "username") // populate with id and username
      .populate("attendeesPets", "name"); //populate with id and petname

    if (!updatedEvent) {
      return res.status(404).json({ status: "error", msg: "Event not found." });
    }

    return res.json({ status: "ok", updatedEvent });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "error", msg: "Failed to join event." });
  }
};
