import axios from "axios";
import express from "express";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import User from "../../models/user.js";
import { ValidationError } from "../../util/error.js";

// URL: /oauth/google/...

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT
);

async function getGoogleUser(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    );

    const googleUser = res.data;
    return googleUser;
  } catch (err) {
    throw err;
  }
}

router.post("/", async (req, res, next) => {
  try {
    if (!("code" in req.query)) {
      throw new ValidationError("code is required");
    }

    const googleUser = await getGoogleUser(req.query.code);
    const name = `${googleUser.given_name} ${googleUser.family_name || ""}`.trim();
    const user = await User.getByEmail(googleUser.email);
    if (!user) {
      const { insertId } = await User.create({
        name,
        email: googleUser.email,
        avatarPath: googleUser.picture,
        authMethod: "google",
      });

      const userId = Number(insertId);
      const token = jwt.sign(userId, process.env.JWT_SECRET);
      res
        .status(201)
        .json({ token, data: { id: userId, name, email: googleUser.email, avatarUrl: googleUser.picture } });
      return;
    }

    if (user.authMethod === "email") {
      throw new ValidationError("this account uses email & password for authentication");
    }

    const updatedUser = { name, avatarPath: googleUser.picture };
    await User.updateById(updatedUser, user.id);
    const token = jwt.sign(user.id, process.env.JWT_SECRET);
    res.json({ token, data: { id: user.id, name, email: user.email, avatarUrl: googleUser.picture } });
  } catch (err) {
    console.error(Object.keys(err));
    if (err.response) {
      const { status, data } = err.response;
      res.status(status).send({ error: data.error_description });
      return;
    }

    next(err);
  }
});

export default router;
