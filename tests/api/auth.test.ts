import { Status } from "std/http/http_status.ts";
import { assertExists } from "std/testing/asserts.ts";
import { afterAll, beforeAll, describe, it } from "std/testing/bdd.ts";
import { Fetch } from "superfetch";
import { Auth, Users } from "./config/routes.ts";

const userData = {
  name: "Example",
  email: "example@example.com",
  password: "******",
};

const deleteUser = async () => {
  const response = await Fetch.delete(Users.deleteMany)
    .send({ email: userData.email });
  response.close();
};

beforeAll(deleteUser);
afterAll(deleteUser);

describe("POST /auth/signup", () => {
  it("should register a new user", async () => {
    const response = await Fetch.post(Auth.signup).send(userData);
    response.expect(Status.Created);
    response.close();
  });

  it("should return 400 if user with the email already exists", async () => {
    const response = await Fetch.post(Auth.signup).send(userData);
    response.expect(Status.Conflict);
    response.close();
  });
});

describe("POST /auth/signin", () => {
  it("should sign in user responding with JWT token and _id", async () => {
    const response = await Fetch.post(Auth.signin)
      .send({ email: "wrong@email.com", password: "wrong" });
    response.expect(Status.BadRequest);
    response.close();
  });

  it("should sign in user responding with JWT token and _id", async () => {
    const response = await Fetch.post(Auth.signin)
      .send({ email: userData.email, password: userData.password });
    response.expect(Status.OK);
    const json = await response.json;
    assertExists(json);
    assertExists(json._id);
    assertExists(json.token);
  });
});
