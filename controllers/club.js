import { body } from "express-validator";
import CustomError from "../Errors/customErrors.js";
import db from "./../config/db.js";

const checkClubExistsById = async (clubId) => {
  try {
    if (!clubId) throw new CustomError("Invalid club ID provided", 400);

    const [clubExists] = await db.execute(
      "SELECT * FROM clubs WHERE id = ? LIMIT 1",
      [clubId]
    );

    return clubExists.length > 0;
  } catch (err) {
    throw new CustomError("Error checking club existence", 500);
  }
};

export const validateClubRules = () => {
  return [
    body("name").notEmpty().withMessage("club name cannot be empty"),
    body("owner").notEmpty().withMessage("club owner cannot be empty"),
    body("manager").notEmpty().withMessage("club manager cannot be empty"),
  ];
};

export const getExistingClub = async (req, res, next) => {
  const { clubId } = req.params;
  try {
    if (!(await checkClubExistsById(clubId))) {
      throw new CustomError("Club not found", 404);
    }

    const [clubExists] = await db.execute(
      "SELECT * FROM clubs WHERE id = ? LIMIT 1",
      [clubId]
    );

    req.club = clubExists[0];
    next();
  } catch (err) {
    next(err);
  }
};
// Get ALL Clubs
export const getAllClubs = async (req, res, next) => {
  try {
    const [clubs] = await db.query("SELECT * FROM clubs");
    res.status(200).json({
      status: true,
      message: "clubs fetched successfully",
      data: clubs,
    });
  } catch (err) {
    next(err);
  }
};

// Create Club
export const createClub = async (req, res, next) => {
  const { name, manager, owner } = req.body;

  try {
    const clubIsExisting = await db.execute(
      "SELECT * FROM Clubs WHERE name = ? LIMIT 1",
      [name]
    );

    if (!!clubIsExisting[0].length)
      throw new CustomError("Club already exists", 400);

    await db.execute(
      "INSERT INTO clubs (name, manager, owner) VALUES (?, ?, ?)",
      [name, manager, owner]
    );
    res.status(200).json({
      status: true,
      message: `Successfully added club`,
      data: req.body,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single Club by Id
export const getClubById = async (req, res, next) => {
  const { club } = req;

  res.status(200).json({
    status: true,
    message: `club fetched successfully`,
    data: club,
  });
};

export const validatePatchClub = async (req, res, next) => {
  const { name, manager, owner } = req.body;

  if (!name && !manager && !owner) {
    return next(
      new CustomError(
        "At least one field (name, manager, owner) must be provided",
        400
      )
    );
  }
  next();
};

// patch club data
export const patchClubById = async (req, res, next) => {
  const {
    club,
    body,
    params: { clubId },
  } = req;

  const name = body?.name || club.name;
  const manager = body?.manager || club.manager;
  const owner = body?.owner || club.owner;
  try {
    const result = await db.execute(
      "UPDATE clubs SET name = ?, manager = ?, owner = ? WHERE id = ?",
      [name, manager, owner, clubId]
    );
    if (result[0].affectedRows === 0) {
      throw new CustomError("Club not found or no changes made", 404);
    }

    res.status(200).json({
      status: true,
      message: `Successfully updated club`,
      data: { name, manager, owner },
    });
  } catch (err) {
    next(err);
  }
};

// update club data
export const updateClubById = async (req, res, next) => {
  const {
    body: { name, manager, owner },
    params: { clubId },
  } = req;

  try {
    if (!name) throw new CustomError("club name cannot be empty", 400);
    if (!owner) throw new CustomError("Club owner cannot be empty", 400);
    if (!manager) throw new CustomError("Club manager cannot be empty", 400);

    const result = await db.execute(
      "UPDATE clubs SET name = ?, manager = ?, owner = ? WHERE id = ?",
      [name, manager, owner, clubId]
    );
    if (result[0].affectedRows === 0) {
      throw new CustomError("Club not found or no changes made", 404);
    }

    res.status(200).json({
      status: true,
      message: `Successfully updated club`,
      data: { name, manager, owner },
    });
  } catch (err) {
    next(err);
  }
};

// Delete Single Club by Id
export const deleteClubById = async (req, res, next) => {
  const {
    params: { clubId },
    club,
  } = req;
  try {
    await db.execute("DELETE FROM clubs WHERE id = ? LIMIT 1", [clubId]);

    res.status(200).json({
      status: true,
      message: `Successfully deleted club`,
      data: club,
    });
  } catch (err) {
    next(err);
  }
};

// Get  Club Players by Id
export const getClubPlayers = async (req, res, next) => {
  const { clubId } = req.params;

  try {
    const [players] = await db.execute(
      `SELECT * FROM players WHERE club_id = ?`,
      [clubId]
    );
    res.status(200).json({
      status: true,
      message: `Successfully fetched club players`,
      data: players,
    });
  } catch (err) {
    next(err);
  }
};
