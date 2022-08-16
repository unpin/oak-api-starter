import { Application } from "oak";
import { DATABASE_URL, DENO_ENV, PORT } from "./config/config.ts";
import { userRouter } from "./resources/user/user.router.ts";
import { authRouter } from "./resources/auth/auth.router.ts";
import { connect } from "./database/connect.ts";
import { timing } from "./middleware/timing.ts";

await connect(DATABASE_URL);

const app = new Application();

if (DENO_ENV === "development") {
  app.use(timing);
}

app.use(userRouter.routes());
app.use(authRouter.routes());

await app.listen({ port: Number(PORT) });
