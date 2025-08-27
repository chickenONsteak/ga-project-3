import mongoose from "mongoose";

const ProfilesSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
      index: true,
    },
    age: { type: Number, min: 0, default: null },
    description: { type: String, default: "" },
    // pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pets", index: true }],
    image: { type: String, default: "" },
  },
  { collection: "profiles" }
);

export default mongoose.model("Profiles", ProfilesSchema);
