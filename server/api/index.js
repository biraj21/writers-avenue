import express from "express";
import authApiRouter from "./auth.js";
import postsApiRouter from "./posts.js";
import usersApiRouter from "./users.js";

// URL: /api/...

const router = express.Router();

router.use("/auth", authApiRouter);
router.use("/posts", postsApiRouter);
router.use("/users", usersApiRouter);

export default router;
