import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { isInteger } from "../util/number.js";

// URL: /comments/...

const router = express.Router();

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", checkAuth, async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

router.delete("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
