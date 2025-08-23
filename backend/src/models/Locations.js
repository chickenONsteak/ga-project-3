import mongoose from "mongoose";

const LocationsSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },  // e.g., "Bishan Dog Run"
  address: { type: String, required: true },
  region: { type: String, enum: ["north", "south", "east", "west"], default: null },
  capacity: { type: Number, min: 1, default: null },
  status: { type: String, enum: ["scheduled","cancelled","completed"], default: "scheduled" },
}, { collection: "locations"});

export default mongoose.model("Locations", LocationsSchema)