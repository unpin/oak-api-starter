import { Router } from "oak";
import { isAuth } from "../../middleware/isAuth.ts";
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
  updatePassword,
} from "./auth.controller.ts";

export const authRouter = new Router();

authRouter
  .post("/auth/signin", signin)
  .post("/auth/signup", signup)
  .post("/forgot-password", forgotPassword)
  .patch("/reset-password/:token", resetPassword)
  .post("/update-password", isAuth, updatePassword);
