import { Router } from "oak";
import { isAuth } from "../../middleware/isAuth.ts";
import {
  deleteAccount,
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
  .post("/password/forgot", forgotPassword)
  .patch("/password/reset/:token", resetPassword)
  .post("/password/update", isAuth, updatePassword)
  .delete("/account/delete", isAuth, deleteAccount);
