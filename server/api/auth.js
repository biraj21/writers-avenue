import express from "express";
import User from "../models/user.js";
import { ValidationError } from "../util/error.js";

// URL: /api/auth/...

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword } = req.body;

    name = name.trim();
    email = email.trim();

    if (await User.getByEmail(email)) {
      throw new ValidationError("User already exists.");
    } else if (password !== confirmPassword) {
      throw new ValidationError("Passwords not matching.");
    }

    await User.create({ name, email, imageUrl: "none", password });
    res.json({ data: "User successfully created." });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }

    next(err);
  }
});

export default router;
