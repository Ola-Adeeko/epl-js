import express from "express";
import { onLogin, onRegister } from "../controllers/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("HEAD BOD");
});

router.post("/login", onLogin);

router.post("/register", onRegister);

export default router;
