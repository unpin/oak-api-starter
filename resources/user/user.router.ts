import { Router } from "oak";
import { isAdmin } from "../../middleware/isAdmin.ts";
import { isAuth } from "../../middleware/isAuth.ts";
import { isUserWithMatchingId } from "../../middleware/isUserWithMatchingId.ts";
import { validateObjectId } from "../../middleware/validateObjectId.ts";
import {
  deleteById,
  deleteMany,
  getById,
  getMany,
  updateById,
} from "../../utils/crud.ts";
import { User } from "./user.model.ts";

export const userRouter = new Router();

userRouter
  .get(
    "/users/:id",
    validateObjectId<"/users/:id">("id"),
    getById(User),
  )
  .get("/users", isAuth, isAdmin, getMany(User))
  .put(
    "/users/:id",
    validateObjectId<"/users/:id">("id"),
    isAuth,
    isUserWithMatchingId,
    updateById(User),
  )
  .delete(
    "/users/:id",
    validateObjectId<"/users/:id">("id"),
    isAuth,
    isUserWithMatchingId,
    /* TODO users can only delete themselves */ deleteById(User),
  )
  .delete("/users", /* isAuth, isAdmin, */ deleteMany(User));
