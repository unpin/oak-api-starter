import {
  create,
  getNumericDate,
  Payload,
} from "https://deno.land/x/djwt@v2.7/mod.ts";
import { JWT_SECRET } from "./config.ts";

export { verify } from "https://deno.land/x/djwt@v2.7/mod.ts";

export const CRYPTO_KEY = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);

export function sign(payload: Payload, privateKey: CryptoKey) {
  const iat = getNumericDate(new Date());
  const exp = iat + 60 * 60 * 24;
  return create(
    { alg: "HS512", typ: "JWT" },
    { iat, exp, ...payload },
    privateKey,
  );
}
