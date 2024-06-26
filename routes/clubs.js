import express from "express";
import {
  getAllClubs,
  createClub,
  getClubById,
  deleteClubById,
  getClubPlayers,
  getExistingClub,
  validatePatchClub,
  patchClubById,
  updateClubById,
} from "../controllers/club.js";
const router = express.Router();

// Get ALL Clubs
router.get("/", getAllClubs);

// Create Club
router.post("/", createClub);

// Get Single Club by Id
router.get("/:clubId", getExistingClub, getClubById);

// Patch Club by Id
router.patch("/:clubId", getExistingClub, validatePatchClub, patchClubById);

// Update Club by Id
router.put("/:clubId", getExistingClub, validatePatchClub, updateClubById);

// Delete Single Club by Id
router.delete("/:clubId", getExistingClub, deleteClubById);

// Get  Club Players by Id
router.get("/:clubId/players", getExistingClub, getClubPlayers);

export default router;
