import {
  afterAll,
  assert,
  assertEquals,
  assertExists,
  beforeAll,
  beforeEach,
  config,
  describe,
  Fetch,
  it,
  Status,
} from "../../deps.ts";
import { generateHexString } from "../../utils/generateHexString.ts";
import { Auth, Users } from "./config/routes.ts";

const { ADMIN_PASSWORD } = await config();

const adminData = {
  email: "admin@example.com",
  password: ADMIN_PASSWORD,
};
let adminToken: string;
let userToken: string;
let userId: string;
let adminId: string;

const userData = {
  name: "John",
  email: "example@gmail.com",
  password: "123456",
};
const fakeUserId = "528d6301a9a3fd49e337dd41";

beforeAll(async () => {
  let res = await Fetch.delete(Users.deleteMany)
    .send({ email: userData.email });
  res.close();
  res = await Fetch.post(Auth.signin).send(adminData);
  let body = await res.json;
  adminToken = body.token;

  res = await Fetch.post(Auth.signup).send(userData);
  body = await res.json;

  userToken = body.token;
  userId = body._id;
});

afterAll(async () => {
  const res = await Fetch.delete(Users.deleteMany)
    .set("Authorization", `Bearer ${adminToken}`).send({
      email: userData.email,
    });
  res.close();
});

describe("GET /users", () => {
  it("should respond with 401 when Bearer Token not provided", async () => {
    const res = await Fetch.get(Users.getAll).end();
    res.expect(Status.Unauthorized);
    res.close();
  });

  it("should return an array of users when admin token provided", async () => {
    const res = await Fetch.get(Users.getAll)
      .set("Authorization", `Bearer ${adminToken}`).end();
    const { data } = await res.json;
    res.expect(Status.OK);
    assertExists(data);
    assert(Array.isArray(data));
  });
});

describe("GET /users/:userId", () => {
  it("should return 400 when userId is not valid", async () => {
    const res = await Fetch.get(Users.deleteOne("*")).end();
    res.expect(Status.BadRequest);
    res.close();
  });

  it("should return 404 when user does not exist", async () => {
    const res = await Fetch.get(Users.deleteOne(fakeUserId))
      .end();
    res.expect(Status.NotFound);
    res.close();
  });

  it("should get user by userId", async () => {
    const res = await Fetch.get(Users.getOne(userId)).end();
    res.expect(200);
    const body = await res.json;
    const user = body.data;
    assertExists(user);
    assertExists(user.email);
    // User must not be present for public
    assertExists(user.password);
  });
});

describe("PUT /users/:userID", () => {
  it("should respond with 400 if uuid is not valid", async () => {
    const res = await Fetch.put(Users.updateOne("*")).send({});
    res.expect(Status.BadRequest);
    res.close();
  });

  it("should respond with 401 if param id doesn't match user id", async () => {
    const res = await Fetch.put(Users.updateOne(fakeUserId)).send({});
    res.expect(Status.Unauthorized);
    res.close();
  });

  // it("should respond with 404 if user does not exist", async () => {
  //   const res = await Fetch.put(Users.updateOne(fakeUserId))
  //     .set("Authorization", userToken)
  //     .send({});
  //   res.expect(Status.NotFound);
  //   res.close();
  // });

  it("should update user", async () => {
    const res = await Fetch.put(Users.updateOne(userId))
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "NewName" });
    res.expect(Status.OK);
    const data = await res.json;
    assertEquals(data.modifiedCount, 1);
  });

  // should respond with 404 if uuid does not exist
  // should respond with 400 if invalid fields provided
  // should update user and return updated user
});

// describe("DELETE /users/:userID", () => {
//   it("should respond with 401 if token is not provided", async () => {
//     const res = await Fetch.delete(`${BASE_URL}/users/123`).end();
//     res.expect(Status.Unauthorized);
//     res.close();
//   });

//   // TODO
//   // it("should respond with 403 if user token and id do not match", async () => {
//   //   const res = await Fetch.delete(`${BASE_URL}/users/123`)
//   //     .set("Authorization", `Bearer ${adminToken}`)
//   //     .end();
//   //   res.expect(Status.Forbidden);
//   //   res.close();
//   // });

//   it("should remove user by userId", async () => {
//     let res = await Fetch.post(`${BASE_URL}/auth/signup`).send({
//       name: "Temp",
//       email: `${generateHexString()}@example.com`,
//       password: "123456",
//     });

//     const { _id, token } = await res.json;
//     res.expect(Status.Created);

//     res = await Fetch.delete(`${BASE_URL}/users/${_id}`)
//       .set("Authorization", `Bearer ${token}`)
//       .end();
//     res.expect(Status.NoContent);

//     // let body = await res.json;
//     // const userId = body._id;

//     // res = await Fetch.delete(`${BASE_URL}/users/${userId}`).end();
//     // res.expect(Status.OK);
//     // body = await res.json;
//   });

//   // should respond with 500 if uuid is not valid
//   // should respond with 404 if uuid does not exist
//   // should respond with 200 if user was successfully deleted
// });

// describe("DELETE /users", () => {
//   it("should remove user by email", async () => {
//   });
// });
