import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import Like from "../models/like.js";
import { isInteger } from "../util/number.js";

// URL: /likes/...

const router = express.Router();

router.get("/:postId", checkAuth(true), async (req, res, next) => {
  try {
    if (!isInteger(req.params.postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    if (!req.userId) {
      res.send({ data: false });
      return;
    }

    const { liked } = await Like.getOne(Number(req.params.postId), req.userId);
    res.send({ data: Boolean(liked) });
  } catch (err) {
    next(err);
  }
});

router.put("/:postId", checkAuth(), async (req, res, next) => {
  try {
    if (!isInteger(req.params.postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    const userId = Number(req.userId);
    const postId = Number(req.params.postId);

    const likeData = await Like.getOne(postId, userId);
    if (!likeData) {
      await Like.create({ postId, userId });
      res.sendStatus(201);
      return;
    }

    const { liked } = likeData;
    await Like.update(!liked, postId, userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
