import cors from "cors";
import express from "express";
import apiRouter from "./api/index.js";
import "./util/database.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
