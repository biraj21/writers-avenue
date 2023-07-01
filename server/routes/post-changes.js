import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { ActionForbiddenError, ValidationError } from "../util/error.js";
import { isInteger } from "../util/number.js";
import upload from "../util/upload.js";
import Post from "../models/post.js";
import PostChanges from "../models/post-changes.js";
import { processPostChanges } from "../util/process-data.js";

// URL: /post/changes/...

const router = express.Router();

router.get("/:postId", async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    postId = Number(postId);
    const postChanges = await PostChanges.getOneByIds(postId, req.userId);
    if (!postChanges) {
      next();
      return;
    }

    const { status } = await Post.getOneXById(["status"], postId);
    postChanges.status = status;
    processPostChanges(postChanges);
    res.send({ data: postChanges });
  } catch (err) {
    next(err);
  }
});

router.put("/:postId", upload.single("cover"), async (req, res, next) => {
  try {
    let { postId } = req.params;
    if (!isInteger(postId)) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    let { title, body, category } = req.body;
    title = title.trim();
    body = body ? body.trim() : null;
    category = category ? category.trim() : null;

    if (title.trim().length === 0) {
      throw new ValidationError("title is required");
    }

    postId = Number(postId);
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

      throw new ActionForbiddenError();
    }

    if (postStatus === "draft") {
      if (req.file) {
        if (coverPath) {
          await fs.unlink(path.join(process.cwd(), coverPath));
        }

        coverPath = `/${req.file.path}`;
      }

      await Post.update(
        {
          title,
          body: body,
          coverPath,
          category: category || null,
          status: "draft",
        },
        postId,
        req.userId
      );
    } else {
      if (req.file) {
        coverPath = `/${req.file.path}`;
      }

      const postChangesData = await PostChanges.getOneXByPostId(["userId"], postId);
      if (!postChangesData) {
        PostChanges.create({ title, body, coverPath, category, postId, userId });
      } else {
        PostChanges.update({ title, body, coverPath, category, postId, userId });
      }
    }

    res.sendStatus(204);
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

    const postChangesData = await PostChanges.getOneXByPostId(["userId"], postId);
    if (!processPostChanges) {
      res.status(404).json({ error: "post not found" });
      return;
    }

    if (req.userId !== postChangesData.userId) {
      throw new ActionForbiddenError();
    }

    postId = Number(postId);
    await PostChanges.delete(postId, req.userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
