import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import apiRouter from "./api/index.js";
import "./util/database.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401).json({ error: "Invalid token!" });
      return;
    }
  }

  next();
});

app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found!" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
