import { Router } from "oak";
import { restrictTo } from "../../middleware/restrictTo.ts";
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
import { User, UserRole } from "./user.model.ts";
import { updateUser } from "./user.controller.ts";

export const userRouter = new Router();

userRouter
  .get(
    "/users/:id",
    validateObjectId<"/users/:id">("id"),
    getById(User),
  )
  .get("/users", restrictTo(UserRole.ADMIN), getMany(User))
  .patch("/users", isAuth, updateUser)
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
  .delete("/users", /* isAuth, restrictTo, */ deleteMany(User));
