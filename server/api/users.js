import express from "express";
import User from "../models/user.js";

// URL: /api/users/...

const router = express.Router();

router.post("/", async (req, res) => {
  let { email, password } = req.body;

  if (await User.getByEmail(email)) {
  }
});

export default router;
