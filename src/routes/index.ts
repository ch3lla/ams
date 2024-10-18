import auth from "./auth";
import lecturer from "./lecturer";
import express from "express";

const router = express.Router();

router.use("/auth", auth);
router.use("/lecturer", lecturer);

export default router;