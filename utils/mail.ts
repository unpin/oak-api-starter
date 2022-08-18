import { SendConfig, SmtpClient } from "smtp";
import {
  SMTP_HOSTNAME,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USERNAME,
} from "../common/config.ts";

const client = new SmtpClient();

export async function sendMail(config: Omit<SendConfig, "from">) {
  await client.connectTLS({
    hostname: SMTP_HOSTNAME,
    port: Number(SMTP_PORT),
    username: SMTP_USERNAME,
    password: SMTP_PASSWORD,
  });
  await client.send({ ...config, from: SMTP_USERNAME });
  await client.close();
}
