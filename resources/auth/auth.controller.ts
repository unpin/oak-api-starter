import { bcrypt, Context, Status } from "../../deps.ts";
import { handleHttpError } from "../../common/handleHttpError.ts";
import { getNumericDate, sign } from "../../lib/jwt.ts";
import { User } from "../user/user.model.ts";
import { HttpError } from "../../common/errors/HttpError.ts";
import { JWT_CRYPTO_KEY } from "../../config/config.ts";

export async function signup(ctx: Context) {
  try {
    const body = await ctx.request.body().value;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);
    body.password = hash;
    const user = await User.findOne({ email: body.email });
    if (user) {
      throw new HttpError({
        message: "User with this email already exists",
        status: Status.Conflict,
      });
    } else {
      // TODO Move JWT token generation to User model once API is provided
      const userId = await User.insertOne(body);
      const iat = getNumericDate(new Date());
      const exp = iat + 60 * 60 * 24;
      const token = await sign({ sub: userId, iat, exp }, JWT_CRYPTO_KEY);
      ctx.response.status = Status.Created;

      ctx.response.body = { _id: userId, token };
      // TODO Should the JWT token be sent as a cookie?
      ctx.cookies.set("token", token);
    }
  } catch (error) {
    handleHttpError(ctx, error);
  }
}

export async function signin(ctx: Context) {
  const body = await ctx.request.body().value;

  try {
    const user = await User.findOne({
      email: body.email,
    }) as {
      _id: string;
      password: string;
      isAdmin: boolean;
    };
    if (!user) {
      throw new HttpError({
        message: "Incorrect email address or password",
        status: Status.BadRequest,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpError({
        message: "Incorrect email address or password",
        status: Status.BadRequest,
      });
    } else {
      ctx.response.status = Status.OK;
      // TODO Move JWT token generation to User model once API is provided
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 60 * 60 * 24;
      ctx.response.body = {
        _id: user._id,
        token: await sign({
          sub: user._id,
          iat,
          exp,
          isAdmin: user.isAdmin,
        }, JWT_CRYPTO_KEY),
      };
    }
  } catch (error) {
    handleHttpError(ctx, error);
  }
}

export function deleteUser() {
  // TODO
}
