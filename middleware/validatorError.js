import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors
      .array()
      .map((error) => ({ status: false, message: error.msg }));
    return res.status(400).json({ status: false, message: errorMsgs });
  }
  next();
};
