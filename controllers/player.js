import CustomError from "../Errors/customErrors.js";
import db from "../config/db.js";
import { body } from "express-validator";

export const checkPlayerExistsById = async (req, res, next) => {
  const { playerId } = req.params;
  try {
    if (!playerId) throw new CustomError("Invalid player id", 400);

    const [playerExists] = await db.execute(
      "SELECT * FROM players WHERE id = ? LIMIT 1",
      [playerId]
    );

    if (!playerExists.length) throw new CustomError("Player not found", 404);

    req.player = playerExists[0];
    next();
  } catch (err) {
    next(err);
  }
};

export const validatePlayerRules = () => {
  return [
    body("name").notEmpty().withMessage("Player name cannot be empty"),
    body("age").notEmpty().withMessage("Player age cannot be empty"),
    body("number").notEmpty().withMessage("Player number cannot be empty"),
    body("country").notEmpty().withMessage("Player country cannot be empty"),
    body("club").notEmpty().withMessage("Player club cannot be empty"),
  ];
};

// Validation result handler middleware
export const validatePlayer = async (req, res, next) => {
  const { name } = req.body;

  try {
    const [playerIsExisting] = await db.execute(
      "SELECT * FROM players WHERE name = ? LIMIT 1",
      [name]
    );

    if (playerIsExisting.length) {
      throw new CustomError("Player already exists", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
};

// Get All Players
export const getAllPlayers = async (req, res, next) => {
  try {
    const [players] = await db.query("SELECT * FROM players");

    res.status(200).json({
      status: true,
      message: "players fetched successfully",
      data: players,
    });
  } catch (err) {
    next(err);
  }
};

// Create Player
export const createPlayer = async (req, res, next) => {
  const { name, age, number, country, club } = req.body;
  try {
    await db.execute(
      "INSERT INTO players (name, age, country, number, club_id) VALUES (?, ?, ?, ?, ? )",
      [name, age, country, number, club]
    );

    res.status(200).json({
      status: true,
      message: `Successfully added player`,
      data: req.body,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single Player by Id
export const getPlayerById = async (req, res, next) => {
  const { player } = req;

  res.status(200).json({
    status: true,
    message: `Successfully fetched player`,
    data: player,
  });
};

// patch player detail
export const patchPlayerById = async (req, res, next) => {
  const {
    player,
    params: { playerId },
    body,
  } = req;

  const name = body?.name || player.name;
  const age = body?.age || player.age;
  const number = body?.number || player.number;
  const country = body?.country || player.country;
  const club = body?.club || player.club_id;

  try {
    const result = await db.execute(
      "UPDATE players set name = ? , age = ? , number = ? , country = ? , club_id = ? WHERE id = ?",
      [name, age, number, country, club, playerId]
    );

    if (result[0].affectedRows === 0) {
      throw new CustomError("Player not found or no changes made", 404);
    }

    res.status(200).json({
      status: true,
      message: `Successfully updated player`,
      data: { name, age, number, country, club },
    });
  } catch (err) {
    next(err);
  }
};

// update player detail
export const updatePlayerById = async (req, res, next) => {
  const {
    body: { name, age, number, country, club },
    params: { playerId },
  } = req;
  try {
    if (!name) throw new CustomError("Player name cannot be empty", 400);
    if (!age) throw new CustomError("Player age cannot be empty", 400);
    if (!number) throw new CustomError("Player number cannot be empty", 400);
    if (!country) throw new CustomError("Player country cannot be empty", 400);
    if (!club) throw new CustomError("Player club cannot be empty", 400);

    const result = await db.execute(
      "UPDATE players set name = ? , age = ? , number = ? , country = ? , club_id = ? WHERE id = ?",
      [name, age, number, country, club, playerId]
    );

    if (result[0].affectedRows === 0) {
      throw new CustomError("Player not found or no changes made", 404);
    }
    res.status(200).json({
      status: true,
      message: `Successfully updated player`,
      data: { name, age, number, country, club },
    });
  } catch (err) {
    next(err);
  }
};

// Delete Single Player by Id
export const deletePlayerById = async (req, res, next) => {
  const {
    player,
    params: { playerId },
  } = req;
  try {
    await db.execute("DELETE FROM players WHERE id = ? LIMIT 1", [playerId]);

    res.status(200).json({
      status: true,
      message: `Successfully deleted player`,
      data: player,
    });
  } catch (error) {
    next(error);
  }
};
