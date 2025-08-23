import PetsModel from "../models/Pets.js";
import AuthModel from "../models/Auth.js";
import mongoose from "mongoose";

export const addPet = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const owner = await AuthModel.findOne({ username }).select("_id"); //search owner id
    if (!owner)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const { name, breed = "", age = null, description = "" } = req.body; //only name is required
    if (!name)
      return res.status(400).json({ status: "error", msg: "name required" });

    const pet = await PetsModel.create({
      ownerId: owner._id,
      name,
      breed,
      age,
      description,
    });
    return res.status(201).json({ status: "ok", pet });
  } catch (e) {
    console.error(e.message);
    return res.status(400).json({ status: "error", msg: "Error adding pet" });
  }
};

export const viewOwnedPets = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const owner = await AuthModel.findOne({ username }).select("_id"); //search owner id
    if (!owner)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const allMyPets = await PetsModel.find({ ownerId: owner._id }); //filter by owner id
    res.json(allMyPets);
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ status: "error", msg: "Error fetching pets" });
  }
};

export const updateOnePet = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const owner = await AuthModel.findOne({ username }).select("_id"); //search owner id
    if (!owner)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const { id } = req.params; //pet id from route
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //checks id format
      return res.status(400).json({ status: "error", msg: "Invalid pet id" });
    }

    const pet = await PetsModel.findOne({ _id: id, ownerId: owner._id }); //load pets belongs to this owner
    if (!pet)
      return res.status(404).json({ status: "error", msg: "Pet not found" });

    const { name, breed, age, description } = req.body; //allow empty fills as valid to update
    if (name !== undefined) pet.name = name;
    if (breed !== undefined) pet.breed = breed;
    if (age !== undefined) pet.age = age;
    if (description !== undefined) pet.description = description;

    await pet.save();
    return res.json({ status: "ok", msg: "Updated pet successfully" });
  } catch (e) {
    console.error(e.message);
    return res.status(400).json({ status: "error", msg: "Error updating pet" });
  }
};

export const deleteOnePet = async (req, res) => {
  try {
    const username = (req.user?.username || req.decoded?.username || "")
      .toLowerCase()
      .trim(); //search logged in user
    if (!username)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const owner = await AuthModel.findOne({ username }).select("_id"); //search owner id
    if (!owner)
      return res.status(401).json({ status: "error", msg: "Unauthorised" });

    const { id } = req.params; //pet id from route
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //checks id format
      return res.status(400).json({ status: "error", msg: "Invalid pet id" });
    }

    //delete if pet belong to this owner
    const pet = await PetsModel.findOneAndDelete({
      _id: id,
      ownerId: owner._id,
    });
    if (!pet)
      return res.status(404).json({ status: "error", msg: "Pet not found" });

    return res.json({ status: "ok", msg: "Pet deleted", id: pet._id });
  } catch (e) {
    console.error("deleteOnePet:", e.message);
    return res.status(500).json({ status: "error", msg: "Server error" });
  }
};
