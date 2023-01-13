export default function checkAuth(req, res, next) {
  if (req.userId) {
    next();
  } else {
    res.status(403).json({ error: "You are not authorized to perform this action!" });
  }
}
