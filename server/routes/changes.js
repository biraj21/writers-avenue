import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import { AuthError, ValidationError } from "../util/error.js";
import { isInteger } from "../util/number.js";
import upload from "../util/upload.js";
import Post from "../models/post.js";

// URL: /changes/...

const router = express.Router();

router.put("/:postId", checkAuth, upload.single("cover"), async (req, res, next) => {
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
    let { coverPath, status: postStatus, userId } = await Post.getOneXById(["coverPath", "status", "userId"], postId);
    if (req.userId !== userId) {
      throw new AuthError();
    }

    if (req.file) {
      if (coverPath) {
        await fs.unlink(path.join(process.cwd(), coverPath));
      }

      coverPath = `/${req.file.path}`;
    }

    if (postStatus === "draft") {
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
      // todo
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
