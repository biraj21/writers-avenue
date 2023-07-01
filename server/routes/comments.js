import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import Comment from "../models/comment.js";
import { ActionForbiddenError } from "../util/error.js";
import { isInteger } from "../util/number.js";
import { processComment } from "../util/process-data.js";

// URL: /comments/...

const router = express.Router();

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const comments = await Comment.getAllByPostId(postId);
    comments.forEach((comment) => processComment(comment));
    res.send({ data: comments });
  } catch (err) {
    next(err);
  }
});

router.post("/", checkAuth, async (req, res, next) => {
  try {
    let { comment, postId } = req.body;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const { insertId } = await Comment.create({ body: comment, postId, userId: req.userId });
    res.status(201).json({ data: Number(insertId) });
  } catch (err) {
    next(err);
  }
});

router.delete("/:commentId", checkAuth, async (req, res, next) => {
  try {
    let { commentId } = req.params;
    if (!isInteger(commentId)) {
      res.status(404).json({ error: "comment not found" });
      return;
    }

    const { affectedRows } = await Comment.delete(commentId, req.userId);
    if (affectedRows === 0) {
      throw new ActionForbiddenError();
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
