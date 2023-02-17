import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import Like from "../models/like.js";
import Post from "../models/post.js";
import PostChanges from "../models/post-changes.js";
import { AuthError, ValidationError } from "../util/error.js";
import { isInteger } from "../util/number.js";
import { processPost } from "../util/process-data.js";
import upload from "../util/upload.js";

// URL: /posts/...

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
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const post = await Post.getOneById(postId);
    if (!post || (post.status !== "pub" && req.userId !== post.userId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    const postChangesData = await PostChanges.getOneXByPostId(["postId"], postId);
    if (postChangesData && req.userId === post.userId) {
      post.hasChanges = true;
    }

    const likeCount = await Like.getCountByPostId(postId);
    post.likeCount = Number(likeCount);

    if (req.userId) {
      const likeData = await Like.getOne(postId, req.userId);
      if (!likeData) {
        post.likedByMe = false;
      } else {
        post.likedByMe = Boolean(likeData.liked);
      }
    }

    processPost(post);
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
});

router.post("/", checkAuth, upload.single("cover"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError("cover image is required");
    }

    const { title, body, category } = req.body;
    const coverPath = `/${req.file.path}`;
    const { insertId } = await Post.create({ title, body, coverPath, category, userId: req.userId });
    res.status(201).json({ data: Number(insertId) });
  } catch (err) {
    next(err);
  }
});

router.put("/:postId", checkAuth, upload.single("cover"), async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const { title, body, category } = req.body;
    const postData = await Post.getOneXById(["coverPath", "status", "userId"], postId);
    if (!postData) {
      if (req.file) {
        await fs.unlink(path.join(process.cwd(), req.file.path));
      }

      res.status(404).json({ error: "post not found" });
      return;
    }

    let { coverPath, status: postStatus, userId } = postData;
    if (req.userId !== userId) {
      if (req.file) {
        await fs.unlink(path.join(process.cwd(), req.file.path));
      }

      throw new AuthError();
    }

    if (req.file) {
      if (coverPath) {
        await fs.unlink(path.join(process.cwd(), coverPath));
      }

      coverPath = `/${req.file.path}`;
    } else if (!coverPath) {
      throw new ValidationError("cover image is required");
    }

    const post = { title, body, coverPath, category };
    if (postStatus === "draft") {
      post.publishDate = new Date();
    }

    const postChangesData = PostChanges.getOneXByPostId(["postId"], postId);
    if (postChangesData) {
      await PostChanges.delete(postId, req.userId);
    }

    await Post.update(post, postId, req.userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.delete("/:postId", checkAuth, async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    let { coverPath, userId } = await Post.getOneXById(["coverPath", "userId"], postId);
    if (req.userId !== userId) {
      throw new AuthError();
    }

    if (coverPath) {
      await fs.unlink(path.join(process.cwd(), coverPath));
    }

    await Post.delete(postId, req.userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post("/drafts", checkAuth, upload.single("cover"), async (req, res, next) => {
  try {
    let { title, body, category } = req.body;
    title = title.trim();
    body = body.trim();
    const coverPath = req.file ? `/${req.file.path}` : null;

    if (title.trim().length === 0) {
      throw new ValidationError("title is required");
    }

    const { insertId } = await Post.create({
      title,
      body: body || null,
      coverPath,
      category: category || null,
      publishDate: null,
      status: "draft",
      userId: req.userId,
    });
    res.status(201).json({ data: Number(insertId) });
  } catch (err) {
    next(err);
  }
});

export default router;
