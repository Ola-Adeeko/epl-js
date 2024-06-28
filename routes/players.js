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
  validatePlayerRules,
} from "../controllers/player.js";
import { handleValidationErrors } from "../middleware/validatorError.js";
const router = express.Router();

// Get All Players
router.get("/", getAllPlayers);

// Create Player
router.post(
  "/",
  validatePlayerRules(),
  handleValidationErrors,
  validatePlayer,
  createPlayer
);

// Get Single Player by Id
router.get("/:playerId", checkPlayerExistsById, getPlayerById);

// Update Player Detail by Id
router.put("/:playerId", checkPlayerExistsById, updatePlayerById);

// Patch Player Detail by Id
router.patch("/:playerId", checkPlayerExistsById, patchPlayerById);

// Delete Single Player by Id
router.delete("/:playerId", checkPlayerExistsById, deletePlayerById);

export default router;
