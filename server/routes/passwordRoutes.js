import express from "express";
import {
  forgetPassword,
  resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
