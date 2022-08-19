import { Router } from "oak";
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
} from "./auth.controller.ts";

export const authRouter = new Router();

authRouter
  .post("/auth/signin", signin)
  .post("/auth/signup", signup)
  .post("/forgot-password", forgotPassword)
  .patch("/reset-password/:token", resetPassword);
