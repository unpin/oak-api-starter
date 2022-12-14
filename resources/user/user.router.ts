import { Router } from "oak";
import { restrictTo } from "../../middleware/restrictTo.ts";
import { isAuth } from "../../middleware/isAuth.ts";
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
    "/users/:id/:sub",
    validateObjectId<"/users/:id/:sub">(["id", "sub"]),
    getById(User),
  )
  .get("/users", restrictTo(UserRole.ADMIN), getMany(User))
  .patch("/users", isAuth, updateUser)
  .put(
    "/users/:id",
    validateObjectId<"/users/:id">(["id"]),
    isAuth,
    updateById(User),
  )
  .delete(
    "/users/:id",
    validateObjectId<"/users/:id">(["id"]),
    isAuth,
    /* TODO users can only delete themselves */ deleteById(User),
  )
  .delete("/users", restrictTo(UserRole.ADMIN), deleteMany(User));
