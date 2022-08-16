import { Router } from "oak";
import { signin, signup } from "./auth.controller.ts";

export const authRouter = new Router();

authRouter
  .post("/auth/signin", signin)
  .post("/auth/signup", signup);
