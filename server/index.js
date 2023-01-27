import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import router from "./routes/index.js";
import "./util/database.js";
import { CustomError } from "./util/error.js";

const app = express();

app.use("/uploads", express.static("./uploads"));
app.use("/resources", express.static("./resources"));
app.use(express.json());
app.use(cors()); // reminder: make sure to set origin to something in production

app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    try {
      req.userId = Number(jwt.verify(token, process.env.JWT_SECRET));
    } catch (err) {
      res.status(401).json({ error: "invalid token" });
      return;
    }
  }

  next();
});

app.use(router);

app.use((req, res, next) => {
  res.status(404).json({ error: "not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}...`));
