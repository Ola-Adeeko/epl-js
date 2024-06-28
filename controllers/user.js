import db from "../config/db.js";

export const getMe = async (req, res, next) => {
  const { currentUser } = req;
  try {
    const [user] = await db.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [currentUser.email]
    );

    res.status(200).json({
      status: true,
      message: "User detail fetched successfully",
      data: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const [users] = await db.execute("SELECT * FROM users");

    const newUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
    }));

    res.status(200).json({
      status: true,
      message: "Users detail fetched successfully",
      data: newUsers,
    });
  } catch (err) {
    next(err);
  }
};
