import mongoose from "mongoose";

const PetsSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    breed: { type: String, default: "" },
    age: { type: Number, min: 0, default: null },
    description: { type: String, default: "" },
  },
  { collection: "pets" }
);

export default mongoose.model("Pet", PetsSchema);
