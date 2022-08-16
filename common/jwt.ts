import { jwt } from "../deps.ts";
import { JWT_CRYPTO_KEY } from "../config/config.ts";

const header: jwt.Header = { alg: "HS512", typ: "JWT" };

export function createJWT(data: jwt.Payload) {
  return jwt.create(header, { ...data }, JWT_CRYPTO_KEY);
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_CRYPTO_KEY);
}
