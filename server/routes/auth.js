import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ValidationError } from "../util/error.js";
import upload from "../util/upload.js";

// URL: /auth/...

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.trim();

    if (password.includes(" ")) {
      throw new ValidationError("password cannot have spaces");
    } else if (password.length < 8) {
      throw new ValidationError("password should be at least 8 characters long");
    }

    const user = await User.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ValidationError("incorrect email or passwordi");
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET);
    res.json({
      token,
      data: { id: user.id, name: user.name, email: user.email, avatarUrl: process.env.SERVER_URL + user.avatarPath },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register", upload.single("avatar"), async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    name = name.trim();
    email = email.trim();

    if (await User.getByEmail(email)) {
      throw new ValidationError("email already taken");
    } else if (password.includes(" ") || confirmPassword.includes(" ")) {
      throw new ValidationError("passwords cannot have spaces");
    } else if (password.length < 8) {
      throw new ValidationError("password should be at least 8 characters long");
    } else if (password !== confirmPassword) {
      throw new ValidationError("passwords do not match!");
    }

    const avatarPath = req.file ? `/${req.file.path}` : "/resources/blank-avatar.png";
    const { insertId } = await User.create({
      name,
      email,
      avatarPath,
      password,
    });
    const userId = Number(insertId);
    const token = jwt.sign(userId, process.env.JWT_SECRET);
    res.json({ token, data: { id: userId, name, email, avatarUrl: process.env.SERVER_URL + avatarPath } });
  } catch (err) {
    next(err);
  }
});

export default router;
