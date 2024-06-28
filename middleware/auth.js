import CustomError from "../Errors/customErrors.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] ?? req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null)
      throw new CustomError("Not authorized to use this resource", 401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) throw new CustomError("token is invalid", 403);
      req.currentUser = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};
