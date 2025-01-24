import auth from "./auth";
import lecturer from "./lecturer";
import student from "./student";
import account from "./account";
import express from "express";

const router = express.Router();

router.use("/auth", auth);
router.use("/lecturer", lecturer);
router.use("/student", student);
router.use("/account", account);

export default router;