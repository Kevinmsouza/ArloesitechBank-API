import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../../src/app";

import User from "../../../src/entities/User";

import * as userFactory from "../../factories/user.factory";
import { clearDatabase, clearTable } from "../../utils/database";

describe("POST /users", () => {
  beforeAll(async() => {
    await init();
    await clearDatabase();
  });
  
  beforeEach(async() => {
    await clearTable(User);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 201 for success", async() => {
    const response = await supertest(app)
      .post("/users")
      .send(userFactory.getValidBody());
    expect(response.status).toBe(201);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/users")
      .send(userFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 409 for email unavailable", async() => {
    await userFactory.createUser();
    const response = await supertest(app)
      .post("/users")
      .send(userFactory.getValidBody());
    expect(response.status).toBe(409);
  });
});
