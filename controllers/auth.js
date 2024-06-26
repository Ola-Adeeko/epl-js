import db from "../config/db.js";
import CustomError from "../Errors/customErrors.js";
import * as bcrypt from "bcrypt";

const saltRounds = 10;

const validateHashedPassword = async (userPassword, hashedPassword) => {
  try {
    const result = await bcrypt.compare(userPassword, hashedPassword);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
const hashPassword = async (userPassword) => {
  try {
    const hashed = await bcrypt.hash(userPassword, saltRounds);
    return hashed;
  } catch (err) {
    throw new Error();
  }
};

export const onLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw new CustomError("Please enter email and password", 400);

    const [userExist] = await db.execute(
      "SELECT * from users WHERE email = ?",
      [email]
    );

    if (!userExist.length) throw new CustomError("User not found", 404);

    const validateUserPassword = await validateHashedPassword(
      password,
      userExist[0].password
    );

    if (!validateUserPassword)
      throw new CustomError("Invalid credentials provided", 400);

    res.status(200).json({
      status: true,
      message: "user logged in successfully",
      data: {
        email: userExist[0]?.email,
        username: userExist[0]?.username,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const onRegister = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username) throw new CustomError("Invalid username provided", 400);
    if (!email) throw new CustomError("Invalid email provided", 400);
    if (!password) throw new CustomError("Invalid password provided", 400);

    const [userExist] = await db.execute(
      "SELECT * from users WHERE email = ?",
      [email]
    );

    if (!!userExist.length)
      throw new CustomError("User with this email already exists", 400);

    const hash_password = await hashPassword(password);

    await db.execute(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, hash_password, username]
    );

    res.status(200).json({
      status: true,
      message: "User created successfully",
      data: req.body,
    });
  } catch (err) {
    next(err);
  }
};
