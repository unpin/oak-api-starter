import {
  create,
  getNumericDate,
  Payload,
} from "https://deno.land/x/djwt@v2.7/mod.ts";

export { verify } from "https://deno.land/x/djwt@v2.7/mod.ts";

export function sign(payload: Payload, privateKey: CryptoKey) {
  const iat = getNumericDate(new Date());
  const exp = iat + 60 * 60 * 24;
  return create(
    { alg: "HS512", typ: "JWT" },
    { iat, exp, ...payload },
    privateKey,
  );
}
