import express from "express";
import googleRouter from "./google.js";

// URL: /oauth/...

const router = express.Router();

router.use("/google", googleRouter);

export default router;
