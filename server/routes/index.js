import express from "express";
import authRouter from "./auth.js";
import commentsRouter from "./comments.js";
import postsRouter from "./posts.js";
import changesRouter from "./post-changes.js";
import usersRouter from "./users.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/comments", commentsRouter);
router.use("/posts/changes", checkAuth, changesRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
