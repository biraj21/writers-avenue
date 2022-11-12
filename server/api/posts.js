import express from "express";

// URL: /api/posts/...

const router = express.Router();

router.get("/", async (req, res) => {
  res.json("It works");
});

export default router;
