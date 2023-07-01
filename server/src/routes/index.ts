import express from "express";
import authRouter from "./auth.js";
import commentsRouter from "./comments.js";
import likesRouter from "./likes.js";
import oauthRouter from "./oauth/index.js";
import postsRouter from "./posts.js";
import postChangesRouter from "./post-changes.js";
import usersRouter from "./users.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/comments", commentsRouter);
router.use("/likes", checkAuth, likesRouter);
router.use("/oauth", oauthRouter);
router.use("/posts/changes", checkAuth, postChangesRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
