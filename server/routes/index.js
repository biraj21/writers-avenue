import express from "express";
import authRouter from "./auth.js";
import changesRouter from "./changes.js";
import postsRouter from "./posts.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/changes", changesRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
