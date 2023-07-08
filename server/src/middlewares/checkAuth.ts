import jwt from "jsonwebtoken";
import { AuthError } from "../util/error.js";

import { Request, Response, NextFunction } from "express";

/**
 * check if user is authenticated for route protection. adds `userId` property to express's request.
 * @param optional false/undefined for protected routes. true when authentication is optional.
 * @returns
 */
export default function checkAuth(optional = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let authorization = req.headers["authorization"];
      if (!authorization) {
        throw new AuthError("token required");
      }

      authorization = authorization.replace(/\s+/, " ");
      if (!/^Bearer [a-zA-Z0-9.\-_]+$/.test(authorization)) {
        throw new AuthError("invalid value for Authorization header");
      }

      const token = authorization.split(" ")[1];
      try {
        req.userId = Number(jwt.verify(token, process.env.JWT_SECRET));
      } catch (err) {
        throw new AuthError("invalid token");
      }

      next();
    } catch (err) {
      if (optional) {
        next();
      } else {
        next(err);
      }
    }
  };
}
