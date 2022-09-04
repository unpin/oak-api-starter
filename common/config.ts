import { config } from "std/dotenv/mod.ts";

await config({
  path: "./.env",
  defaults: "./.env.defaults",
  example: "./.env.example",
  allowEmptyValues: true,
  export: false,
  safe: false,
});

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
} = Deno.env.toObject();

console.log({
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
});

export const JWT_CRYPTO_KEY = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
