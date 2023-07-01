import jwt from "jsonwebtoken";
import { AuthError } from "../util/error.js";

export default function checkAuth(req, res, next) {
  try {
    let authorization = req.headers["authorization"];
    if (!authorization) {
      throw new AuthError("token required");
    }

    authorization = authorization.replace(/\s+/, " ");
    if (!/^Bearer [a-zA-Z0-9.]+$/.test(authorization)) {
      throw new AuthError("invalid value for Authorization header");
    }

    const token = authorization.split(" ")[1];
    try {
      req.userId = Number(jwt.verify(token, process.env.JWT_SECRET));
    } catch (err) {
      throw new AuthError("invalid token");
    }
  } catch (err) {
    next(err);
  }
}
