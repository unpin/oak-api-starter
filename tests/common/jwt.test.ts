import { createJWT, verifyJWT } from "../../common/jwt.ts";
import { assertEquals, assertRejects, describe, it } from "../../deps.ts";

const userData = {
  name: "John",
  email: "example@example.com",
};

describe("JWT", () => {
  it("should create and verify JWT token", async () => {
    const encoded = await createJWT(userData);
    assertEquals(typeof encoded, "string");
    const decoded = await verifyJWT(encoded);
    assertEquals(typeof decoded, "object");
  });

  it("should throw if JWT is expired", async () => {
    const seconds = Math.floor(Date.now() / 1000);
    const iat = seconds - 100;
    const exp = seconds - 10;
    const token = await createJWT({ userData, exp, iat });

    assertRejects(async () => {
      await verifyJWT(token);
    });
  });
});
