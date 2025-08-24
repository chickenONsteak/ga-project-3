import Profiles from "../models/Profiles.js";

export const getMyProfile = async (req, res) => {
  //view own profile
  const profile = await Profiles.findOne({ authId: req.decoded.id });
  if (!profile)
    return res.status(404).json({ status: "error", msg: "Profile not found." });
  res.json(profile);
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
        return res.status(400).json({ status: "error", msg: "Age must be a number" });
      }
      update.age = age;
    }
    //if description is present
    if ("description" in req.body) {
      update.description = String(req.body.description ?? "").trim(); //if undefined return ""
    }

    //if kvp of update has nothing
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ status: "error", msg: "No fields to update" });
    }

  const profileUpdate = await Profiles.findOneAndUpdate(
    { authId: userId },
    { $set: update },
    { new: true, upsert: true } // return updated & create new if dont exist
  );
  res.json({ status: "ok", profileUpdate });
} catch (e) {
    console.error(e.message);
    return res.status(400).json({status: "error", msg: "Error updating profile."})
}
};
