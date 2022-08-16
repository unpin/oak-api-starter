import { config } from "../deps.ts";

const getEnv = async () => {
  return await config({
    path: "./.env",
    defaults: "./.env.defaults",
    example: "./.env.example",
    allowEmptyValues: false,
    export: false,
    safe: true,
  });
};

export const {
  DENO_ENV,
  DATABASE_URL,
  LOGGING_LEVEL,
  PORT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET,
} = await getEnv();

export const JWT_CRYPTO_KEY = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
