import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import AuthModel from "../models/Auth.js";

export const register = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ username: req.body.username }); //find username in db
    if (auth) {
      //if username exists
      return res
        .status(400)
        .json({ status: "error", msg: "Username already exist" });
    }
    const hash = await bcrypt.hash(req.body.password, 12);
    await AuthModel.create({
      username: req.body.username,
      hash,
      role: "user", //when registering, not allowed to choose admin
    });
    return res.status(201).json({ status: "ok", msg: "User registered" });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ status: "error", msg: "Failed to register" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.find();
    const outputArray = [];
    for (const user of users) {
      outputArray.push({ username: user.username, role: user.role });
    }
    res.json(outputArray);
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ status: "error", msg: "Error getting users" });
  }
};

export const login = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ username: req.body.username });
    if (!auth) {
      console.error("user not found");
      return res.status(401).json({ status: "error", msg: "Not authorised" });
    }
    const result = await bcrypt.compare(req.body.password, auth.hash);
    if (!result) {
      console.error("username or password error");
      return res.status(401).json({ status: "error", msg: "Login failed" });
    }
    const claims = { username: auth.username, role: auth.role };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Login failed" });
  }
};

export const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const claims = { username: decoded.username, role: decoded.role }; //grab decoded cause is faster ( no need to call API )
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ status: "error", msg: "Refresh error" });
  }
};

export const promoteByUsername = async (req, res) => {
  try {
    const raw = req.body?.username;
    if (!raw) {
      return res
        .status(400)
        .json({ status: "error", msg: "username required" });
    }
    const uname = raw.toLowerCase().trim();
    const user = await AuthModel.findOne(
      { username: uname },
      { username: 1, role: 1 }
    );
    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    if (user.role === "admin") {
      return res.json({ status: "ok", msg: "User is already admin", user });
    }

    user.role = "admin";
    await user.save();

    return res.json({ status: "ok", msg: "User promoted to admin", user });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Error promoting user" });
  }
};
