import { dango } from "../deps.ts";
import { LOGGER } from "../common/Logger.ts";
import { User } from "../resources/user/user.model.ts";
import { seed } from "./seed.ts";

const MODELS = [User];

export async function connect(connectionString: string) {
  try {
    const connection = await dango.connect(connectionString);
    MODELS.forEach((model) => model.connection = connection);
    await seed();
  } catch (error) {
    LOGGER.critical(error);
  }
}
