import Profiles from "../models/Profiles.js";
import Pets from "../models/Pets.js";
import mongoose from "mongoose";

export const getMyProfile = async (req, res) => {
  // view own profile
  const authId = req.decoded?.id;

  const profile = await Profiles.findOne({ authId }).lean(); //plain JS Object (faster)
  if (!profile) {
    return res.status(404).json({ status: "error", msg: "Profile not found." });
  }
  const pets = await Pets.find({ ownerId: authId }).lean(); //fetch pet owned by me

  res.json({ profile, pets });
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.decoded?.id;
    if (!userId) {
      return res.status(401).json({ status: "error", msg: "Unauthorised" });
    }
    const update = {};
    //if age is present check
    if ("age" in req.body) {
      const raw = req.body.age;
      const age =
        raw === "" || raw === null || raw === undefined ? null : Number(raw);
      if (age !== null && Number.isNaN(age)) {
        return res
          .status(400)
          .json({ status: "error", msg: "Age must be a number" });
      }
      update.age = age;
    }
    //if description is present
    if ("description" in req.body) {
      update.description = String(req.body.description ?? "").trim(); //if undefined return ""
    }

    const uploadedImage = //assuming using upload libraries
      req.file?.secure_url || req.file?.location || req.file?.path || "";
    const bodyImage =
      typeof req.body?.image === "string" ? req.body.image.trim() : "";

    const image = uploadedImage || bodyImage || ""; //if none available, return empty string (fill not required)

    if (image) {
      //if exist, update (not required fill)
      update.image = image;
    }

    //if kvp of update has nothing
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "No fields to update" });
    }

    const profileUpdate = await Profiles.findOneAndUpdate(
      { authId: userId },
      { $set: update },
      { new: true, upsert: true } // return updated & create new if dont exist
    );
    res.json({ status: "ok", profileUpdate });
  } catch (e) {
    console.error(e.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error updating profile." });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params; //authId

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: "error", msg: "Invalid user id" });
    }
    // const profile = await Profiles.findOne({ authId: id }).lean(); //plain JS Object (faster)
    // if (!profile) {
    //   return res
    //     .status(404)
    //     .json({ status: "error", msg: "Profile not found." });
    // }

    // const pets = await Pets.find({ ownerId: id })
    //   .select("name breed age description image") //doesnt show other info
    //   .lean();

    const [profile, pets] = await Promise.all([ //run parallel
      Profiles.findOne({ authId: id })
        .select("authId age description image") // only public fields
        .lean(),
      Pets.find({ ownerId: id })
        .select("name breed age description image") // include pet image
        .sort({ name: 1 })
        .lean(),
    ]);

    return res.json({ profile, pets });
  } catch (e) {
    console.error(e.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error getting public profile" });
  }
};
