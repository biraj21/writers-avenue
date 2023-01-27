import { AuthError } from "../util/error.js";

export default function checkAuth(req, res, next) {
  if ("userId" in req) {
    next();
  } else {
    next(new AuthError());
  }
}
