import Profiles from "../models/Profiles.js";

export const getMyProfile = async (req, res) => {
  //view own profile
  const profile = await Profiles.findOne({ authId: req.decoded.id });
  if (!profile)
    return res.status(404).json({ status: "error", msg: "Profile not found." });
  res.json(profile);
};

export const updateMyProfile = async (req, res) => {
  const update = {};
  if (req.body.age !== undefined) update.age = req.body.age;
  if (req.body.description !== undefined)
    update.description = req.body.description;

  const profileUpdate = await Profiles.findOneAndUpdate(
    { authId: userId },
    { $set: update },
    { new: true, upsert: true } // return updated & create new if dont exist
  );
  res.json({ status: "ok", profileUpdate });
};
