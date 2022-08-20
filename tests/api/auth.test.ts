import { Status } from "oak";
import { assertExists } from "std/testing/asserts.ts";
import { Fetch } from "superfetch";
import { createRandomUser } from "../../utils/randomUser.ts";
import { Auth } from "./config/routes.ts";

Deno.test("user registration", async ({ step }) => {
  const randomUser = createRandomUser();

  await step("should return status 201 and a token", async () => {
    const response = await Fetch.post(Auth.signup).send(randomUser);
    response.expect(Status.Created);
    const { token } = await response.json;
    assertExists(token);
    response.close();
  });

  await step("should return status 409 when email already exists", async () => {
    const response = await Fetch.post(Auth.signup).send(randomUser);
    response.expect(Status.Conflict);
    response.close();
  });

  await step(
    "should return status 400 when required fields are not provided",
    async () => {
      const response = await Fetch.post(Auth.signup).send({});
      response.expect(Status.BadRequest);
      response.close();
    },
  );

  await step(
    "should return status 400 when if password is less than 6 characters long",
    async () => {
      const response = await Fetch.post(Auth.signup).send({
        ...createRandomUser(),
        password: "12345",
      });
      response.expect(Status.BadRequest);
      response.close();
    },
  );
});

Deno.test("user signing in", async ({ step }) => {
  await step("should return a 200 status and JWT token", async ({ step }) => {
    const randomUser = createRandomUser();
    let response = await Fetch.post(Auth.signup).send(randomUser);
    response.expect(Status.Created);
    response.close();
    response = await Fetch.post(Auth.signin).send(randomUser);
    response.expect(Status.OK);
    const { token } = await response.json;
    assertExists(token);
    await step("should return 401 if password is incorrect", async () => {
      const response = await Fetch.post(Auth.signin)
        .send({ email: randomUser.email, password: "wrong" });
      response.expect(Status.Unauthorized);
      response.close();
    });
  });
});

Deno.test("should return a 204 and delete user", async () => {
  const { name, email, password } = createRandomUser();
  let response = await Fetch.post(Auth.signup)
    .send({ email, name, password });
  response.expect(Status.Created);
  const { token } = await response.json;
  assertExists(token);
  response = await Fetch.delete(Auth.deleteAccount)
    .set("Authorization", `Bearer ${token}`)
    .send({ password });
  response.expect(Status.NoContent);
});
