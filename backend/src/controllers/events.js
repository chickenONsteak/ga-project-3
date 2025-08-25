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

export const leaveEvent = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username) {
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    //search current user intending to leave event (logged in user)
    const user = await AuthModel.findOne({ username }).select("_id");
    if (!user) {
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ status: "error", msg: "Invalid eventId." });
    }

    const myPets = await PetsModel.find({ ownerId: user._id }).select("_id"); //get all owned pets
    const myPetIds = myPets.map((p) => p._id);

    const updatedEvent = await EventsModel.findByIdAndUpdate(
      //get array from event and update
      eventId,
      {
        $pull: {
          attendeesUsers: user._id,
          ...(myPetIds.length ? { attendeesPets: { $in: myPetIds } } : {}), //match each petId
        },
      },
      { new: true } //return updated
    )
      .populate("attendeesUsers", "username")
      .populate("attendeesPets", "name");

    if (!updatedEvent) {
      return res.status(404).json({ status: "error", msg: "Event not found." });
    }

    return res.json({
      status: "ok",
      msg: "You have left the event.",
      updatedEvent,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({
      status: "error",
      msg: "An error occurred. Please try again later.",
    });
  }
};

export const removePetFromEvent = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username) {
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    const user = await AuthModel.findOne({ username }).select("_id");
    if (!user) {
      //search current user
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }

    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ status: "error", msg: "Invalid eventId." });
    }

    const { petIds = [] } = req.body || {};
    const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
    const cleanIdArray = (arr) => [
      ...new Set(arr.filter((id) => typeof id === "string" && isValidId(id))),
    ];
    const cleanedPetIds = cleanIdArray(petIds);
    if (cleanedPetIds.length === 0) {
      return res.status(400).json({
        status: "error",
        msg: "Provide one or more valid petIds to remove.",
      });
    }

    // make sure pets belongs to this user
    const ownedPets = await PetsModel.find({
      _id: { $in: cleanedPetIds },
      ownerId: user._id, 
    }).select("_id");

    const ownedPetIds = ownedPets.map((p) => p._id);

    if (ownedPetIds.length === 0) {
      return res.status(400).json({
        status: "error",
        msg: "None of these pets belong to you.",
      });
    }

    const updatedEvent = await EventsModel.findByIdAndUpdate(
      eventId,
      { $pull: { attendeesPets: { $in: ownedPetIds } } }, //to remove selected petid
      { new: true } //return updated
    )
      .populate("attendeesUsers", "username")
      .populate("attendeesPets", "name");

    if (!updatedEvent) {
      return res.status(404).json({ status: "error", msg: "Event not found." });
    }

    return res.json({
      status: "ok",
      msg: "Selected pets removed from event.",
      updatedEvent,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({
      status: "error",
      msg: "An error occurred. Please try again later.",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const host = await AuthModel.findOne({ username }).select("_id"); //find host id
    if (!host)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const { eventId: id } = req.params; // get id from route
    const isValidId = (x) => mongoose.Types.ObjectId.isValid(x);
    if (!isValidId(id)) {
      return res.status(400).json({ status: "error", msg: "Invalid event id" });
    }

    const current = await EventsModel.findOne({ _id: id, hostUserId: host._id }) //ensure host is same
      .select("startAt endAt locationId"); //return these keys only (faster response)
    if (!current) {
      return res.status(404).json({ status: "error", msg: "Event not found" });
    }

    const {
      title,
      description,
      locationId,
      startAt,
      endAt,
      status, //enum fills
    } = req.body || {}; //deconstruct

    const update = {}; //allow some fills to update

    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description);

    if (locationId !== undefined) {
      //to update once location is completed
      if (!isValidId(locationId)) {
        //only checks mongo format
        return res
          .status(400)
          .json({ status: "error", msg: "Invalid locationId." });
        // const loc = await LocationsModel.findById(locationId).select("_id");
        // if (!loc) return res.status(404).json({ status: "error", msg: "Location not found." });
      }
      update.locationId = locationId;
    }

    let nextStart = current.startAt;
    let nextEnd = current.endAt;

    if (startAt !== undefined) {
      const s = new Date(startAt);
      if (isNaN(s.getTime())) {
        //convert ms Nan
        return res
          .status(400)
          .json({ status: "error", msg: "Invalid startAt." });
      }
      nextStart = s;
      update.startAt = s;
    }

    if (endAt !== undefined) {
      const e = new Date(endAt);
      if (isNaN(e.getTime())) {
        return res.status(400).json({ status: "error", msg: "Invalid endAt." });
      }
      nextEnd = e;
      update.endAt = e;
    }

    //time validation
    if (
      (startAt !== undefined || endAt !== undefined) &&
      nextEnd <= nextStart
    ) {
      //if date is updated, check comparison
      return res
        .status(400)
        .json({ status: "error", msg: "endAt must be after startAt." });
    }

    if (status !== undefined) {
      //will use schema enum validation
      update.status = status;
    }

    const updated = await EventsModel.findOneAndUpdate(
      { _id: id, hostUserId: host._id }, //filter host only
      { $set: update },
      { new: true, runValidators: true } //return updated
    )
      .populate("attendeesUsers", "username")
      .populate("attendeesPets", "name");

    if (!updated) {
      return res.status(404).json({ status: "error", msg: "Event not found" });
    }

    return res.json({
      status: "ok",
      msg: "Updated event successfully.",
      updated,
    });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Error updating event." });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ status: "error", msg: "Invalid eventId." });
    }

    const event = await EventsModel.findById(eventId)
      .populate("hostUserId", "username")
      // .populate("locationId", "name address")    //to include after completing location
      .populate("attendeesUsers", "username")
      .populate("attendeesPets", "name");
    // .populate("attendeesUsers")
    // .populate("attendeesPets");
    // console.log(event.attendeesUsers);
    // console.log(event.attendeesPets);

    if (!event) {
      return res.status(404).json({ status: "error", msg: "Event not found." });
    }

    return res.json({ status: "ok", event });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "error", msg: "Failed to fetch event." });
  }
};

export const deleteEventById = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const host = await AuthModel.findOne({ username }).select("_id"); //find host id
    if (!host)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const { eventId } = req.params; // get id from route
    const isValidId = (x) => mongoose.Types.ObjectId.isValid(x);
    if (!isValidId(eventId)) {
      return res.status(400).json({ status: "error", msg: "Invalid event id" });
    }

    const deleted = await EventsModel.findOneAndDelete({
      _id: eventId,
      hostUserId: host._id,
    });

    if (!deleted) {
      //only host can delete event
      return res.status(404).json({
        status: "error",
        msg: "Event not found or you are not the host.",
      });
    }

    return res.json({ status: "ok", msg: "Event deleted successfully." });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Failed to delete event." });
  }
};
