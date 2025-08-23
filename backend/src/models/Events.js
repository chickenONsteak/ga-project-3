import mongoose from "mongoose";

const EventsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
      required: true,
      index: true,
    },
    hostUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    startAt: { type: Date, required: true }, //reflects date and time
    endAt: { type: Date, required: true },

    attendeesUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Auth", index: true },
    ],
    attendeesPets: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Pets", index: true },
    ],
    status: { type: String, enum: ["scheduled","cancelled","completed"], default: "scheduled" },
  },
  { collection: "events" }
);

export default mongoose.model("Events", EventsSchema);
