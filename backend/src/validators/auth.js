import { body } from "express-validator";

export const validateRegistrationData = [
  body("username", "username is required").notEmpty(),
  body("username", "username min is 3 and max is 50 characters").isLength({
    min: 3,
    max: 50,
  }),
  body("password", "password is required").notEmpty(),
  body("password", "password min is 12 and max is 50 characters").isLength({
    min: 12,
    max: 50,
  }),
];

export const validateLoginData = [
  body("username", "username is required").notEmpty(),
  body("password", "password is required").notEmpty(),
];
