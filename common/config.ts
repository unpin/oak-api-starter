import { config } from "std/dotenv/mod.ts";

const getEnv = async () => {
  return Object.assign(await config(), Deno.env.toObject());
};

export const {
  DENO_ENV,
  DATABASE_URL,
  LOGGING_LEVEL,
  PORT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET,
  SMTP_HOSTNAME,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
} = await getEnv();

export const JWT_CRYPTO_KEY = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
