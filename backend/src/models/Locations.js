import mongoose from "mongoose";

const LocationsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "Bishan Dog Run"
    address: { type: String, required: true },
    region: {
      type: String,
      enum: ["north", "south", "east", "west"],
    },
    capacity: { type: Number, min: 1, default: null },
    image: { type: String, required: true },
  },
  { collection: "locations" }
);

export default mongoose.model("Locations", LocationsSchema);
