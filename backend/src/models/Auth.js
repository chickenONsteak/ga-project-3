import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    hash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true, default: "user" }, //only allow admin or user in db
    create_at: { type: Date, default: Date.now },
  },
  { collection: "auth", timestamps: true } //db collection + timestamps for create & update
);

export default mongoose.model("Auth", AuthSchema);
