import express from "express";
import {
  checkPlayerExistsById,
  createPlayer,
  deletePlayerById,
  getAllPlayers,
  getPlayerById,
  patchPlayerById,
  updatePlayerById,
  validatePlayer,
} from "../controllers/player.js";
const router = express.Router();

// Get All Players
router.get("/", getAllPlayers);

// Create Player
router.post("/", validatePlayer, createPlayer);

// Get Single Player by Id
router.get("/:playerId", checkPlayerExistsById, getPlayerById);

// Update Player Detail by Id
router.put("/:playerId", checkPlayerExistsById, updatePlayerById);

// Patch Player Detail by Id
router.patch("/:playerId", checkPlayerExistsById, patchPlayerById);

// Delete Single Player by Id
router.delete("/:playerId", checkPlayerExistsById, deletePlayerById);

export default router;
