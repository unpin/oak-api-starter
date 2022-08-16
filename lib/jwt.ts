import { create, Payload } from "https://deno.land/x/djwt@v2.7/mod.ts";

export { getNumericDate, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";

export function sign(payload: Payload, privateKey: CryptoKey) {
  return create({ alg: "HS512", typ: "JWT" }, payload, privateKey);
}
