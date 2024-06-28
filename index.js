import express from "express";

import clubRoutes from "./routes/clubs.js";
import playerRoutes from "./routes/players.js";
import baseRoutes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import errorHandler from "./Errors/errorHandler.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", baseRoutes);

// authenticated routes
app.use("/users", authenticateToken, userRoutes);
app.use("/clubs", clubRoutes);
app.use("/players", playerRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`EPL listening on port ${8080}`);
});
