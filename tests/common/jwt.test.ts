import { sign, verify } from "../../common/jwt.ts";
import { assertEquals, assertRejects } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";
import { JWT_CRYPTO_KEY } from "../../common/config.ts";

const userData = {
  name: "John",
  email: "example@example.com",
};

describe("JWT", () => {
  it("should create and verify JWT token", async () => {
    const encoded = await sign(userData, JWT_CRYPTO_KEY);
    assertEquals(typeof encoded, "string");
    const decoded = await verify(encoded, JWT_CRYPTO_KEY);
    assertEquals(typeof decoded, "object");
  });

  it("should throw if JWT is expired", async () => {
    const seconds = Math.floor(Date.now() / 1000);
    const iat = seconds - 100;
    const exp = seconds - 10;
    const token = await sign({ userData, exp, iat }, JWT_CRYPTO_KEY);

    assertRejects(async () => {
      await verify(token, JWT_CRYPTO_KEY);
    });
  });
});
