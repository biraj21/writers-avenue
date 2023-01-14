import express from "express";
import Post from "../models/post.js";
import User from "../models/user.js";

// URL: /api/users/...

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    userId = Number(userId);
    if (!Number.isInteger(userId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    const user = await User.getById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    const posts = await Post.findByUserId(userId);
    user.posts = Array.from(posts);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
