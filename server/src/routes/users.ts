import express from "express";
import Post from "../models/post.js";
import User from "../models/user.js";
import { processUser } from "../util/process-data.js";

// URL: /users/...

const router = express.Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const user = await User.getById(userId);
    if (!user) {
      res.status(404).json({ error: "user not found" });
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
