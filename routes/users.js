import express from "express";
import { getMe, getUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/me", getMe);

export default router;
