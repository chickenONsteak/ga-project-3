import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AuthModel from "../models/Auth.js";
import { connectDB } from "../db/db.js";

const main = async () => {
  connectDB();
  //create admin
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  //.env admin not set
  if (!username || !password) {
    throw new Error("No ADMIN_USERNAME or ADMIN_PASSWORD set in .env");
  }

  //promoting user to admin or create new
  const existing = await AuthModel.findOne({ username });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Promoted existing user to admin: ${username}`);
    } else {
      console.log(`${username} is already an admin`);
    }
  } else {
    const hash = await bcrypt.hash(password, 12);
    await AuthModel.create({ username, hash, role: "admin" });
    console.log(`Created admin: ${username}`);
  }
  await mongoose.disconnect(); //proper shutdown
  process.exit(0); //exit without error
};

main().catch((e) => {
  console.error("Failed to seed Admin", e.message);
  process.exit(1); //exit with error
});

//npm run seed:admin
