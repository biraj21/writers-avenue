import fs from "node:fs";
import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import Post from "../models/post.js";
import { ValidationError } from "../util/error.js";
import { isInteger } from "../util/number.js";
import { processPost } from "../util/process_data.js";
import upload from "../util/upload.js";

// URL: /api/posts/...

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { cat } = req.query;
    const posts = await (cat ? Post.getByCategory(cat) : Post.getAll());
    posts.forEach(processPost);
    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
});

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    postId = Number(postId);
    const post = await Post.getById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    processPost(post);
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
});

router.post("/", upload.single("cover"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError("Cover image is required!");
    }

    const { title, body, category } = req.body;
    const coverPath = `/${req.file.path}`;
    const { insertId } = await Post.create({ title, body, coverPath, category, userId: req.userId });
    res.status(201).json({ data: Number(insertId) });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }

    next(err);
  }
});

router.delete("/:postId", checkAuth, async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    postId = Number(postId);
    const { affectedRows } = await Post.deleteByIdAndUser(postId, req.userId);
    if (affectedRows === 0) {
      res.status(403).json({ error: "You are not authorized to perform this action!" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.put("/:postId", upload.single("cover"), async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    let coverPath = req.file ? `/${req.file.path}` : null;

    postId = Number(postId);
    const { title, body, category } = req.body;
    const { affectedRows } = await Post.updateByIdAndUser({
      id: postId,
      title,
      body,
      coverPath,
      category,
      userId: req.userId,
    });

    if (affectedRows === 0) {
      res.status(403).json({ error: "You are not authorized to perform this action!" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }

    next(err);
  }
});

export default router;
