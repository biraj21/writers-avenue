import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import authRouter from "./auth.js";
import changesRouter from "./changes.js";
import commentsRouter from "./comments.js";
import postsRouter from "./posts.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/changes", checkAuth, changesRouter);
router.use("/comments", commentsRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
