import cors from "cors";
import express from "express";
import router from "./routes/index.js";
import "./util/database.js";
import { CustomError } from "./util/error.js";

const app = express();

app.use("/uploads", express.static("./uploads"));
app.use("/resources", express.static("./resources"));
app.use(express.json());
app.use(cors()); // reminder: make sure to set origin to something in production

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
