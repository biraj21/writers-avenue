import express from "express";
import Post from "../models/post.js";
import { ValidationError } from "../util/error.js";
import upload from "../util/upload.js";

// URL: /api/posts/...

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { cat } = req.query;

  try {
    let posts;
    if (cat) {
      posts = await Post.findSomeByCategory(cat);
    } else {
      posts = await Post.findAll();
    }

    res.json({ data: posts });
  } catch (err) {
    next(err);
  }
});

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    postId = Number(postId);
    if (!Number.isInteger(postId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    res.json({ data: post });
  } catch (err) {
    next(err);
  }
});

router.post("/", upload.single("thumbnail"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError("Thumbnail is required!");
    }

    const { title, body, category } = req.body;
    const imageUrl = `/${req.file.path}`;
    const { insertId } = await Post.create({ title, body, imageUrl, category, userId: req.userId });
    res.status(201).json({ data: Number(insertId) });
    console.log(res.end);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }

    next(err);
  }
});

router.delete("/:postId", async (req, res, next) => {
  console.log(req.params.postId, req.userId);

  try {
    if (!req.userId) {
      res.status(403).json({ error: "You are not authorized to perform this action!" });
      return;
    }

    let { postId } = req.params;
    postId = Number(postId);
    if (!Number.isInteger(postId)) {
      res.status(404).json({ error: "Post not found!" });
      return;
    }

    const { affectedRows } = await Post.deleteByIdAndUser(postId, req.userId);
    if (affectedRows === 0) {
      res.status(403).json({ error: "You are not authorized to perform this action!" });
      return;
    }

    res.json({});
  } catch (err) {
    next(err);
  }
});

export default router;
