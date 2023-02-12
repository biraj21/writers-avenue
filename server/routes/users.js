import express from "express";
import Post from "../models/post.js";
import User from "../models/user.js";
import { isInteger } from "../util/number.js";
import { processUser } from "../util/process-data.js";

// URL: /users/...

const router = express.Router();

router.get("/:userId", async (req, res, next) => {
  try {
    let { userId } = req.params;
    if (!isInteger(userId)) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    userId = Number(userId);
    const user = await User.getById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    const posts = await Post.getByUserId(userId, userId === req.userId ? "*" : "pub");
    user.posts = posts;
    processUser(user);

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
