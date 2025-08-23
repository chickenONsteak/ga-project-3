import { validationResult } from "express-validator";

const checkError = (req, res, next) => {
  console.log("Ran checkError 1");
  const errors = validationResult(req); //all errors accumulated in req

  if (!errors.isEmpty()) {
    res.status(400).json({ status: "error", msg: errors.array() });
  } else {
    next();
  }
};

export default checkError;
