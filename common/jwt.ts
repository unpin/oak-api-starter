import { jwt } from "../deps.ts";
import { JWT_SECRET } from "../config/config.ts";

const header: jwt.Header = { alg: "HS512", typ: "JWT" };
const keyHS512 = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);

export function createJWT(data: jwt.Payload) {
  return jwt.create(header, { ...data }, keyHS512);
}

export function verifyJWT(token: string) {
  return jwt.verify(token, keyHS512);
}
