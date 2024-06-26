import express from "express";

import clubRoutes from "./routes/clubs.js";
import playerRoutes from "./routes/players.js";
import baseRoutes from "./routes/index.js";
import errorHandler from "./Errors/errorHandler.js";

const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/clubs", clubRoutes);
app.use("/players", playerRoutes);

app.use("/", baseRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`EPL listening on port ${8080}`);
});
