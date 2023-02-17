import express from "express";
import Like from "../models/like.js";
import { AuthError } from "../util/error.js";
import { isInteger } from "../util/number.js";

// URL: /likes/...

const router = express.Router();

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const likeData = await Like.getOne(postId, req.userId);
    if (!likeData) {
      res.send({ data: false });
    }

    res.send({ data: Boolen(likeData.liked) });
  } catch (err) {
    next(err);
  }
});

router.put("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const likeData = await Like.getOne(postId, req.userId);
    if (!likeData) {
      await Like.create({ postId, userId: req.userId });
      res.sendStatus(201);
      return;
    }

    const { liked } = likeData;
    await Like.update({ liked: !liked, postId, userId: req.userId });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
