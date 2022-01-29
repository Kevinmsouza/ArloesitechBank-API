import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../../src/app";
import Session from "../../../src/entities/Session";

import User from "../../../src/entities/User";

import * as userFactory from "../../factories/user.factory";
import { clearDatabase, clearTable } from "../../utils/database";

describe("POST /auth/sign-in", () => {
  beforeAll(async() => {
    await init();
    await clearDatabase();
  });
  
  beforeEach(async() => {
    await clearTable(Session);
    await clearTable(User);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    await userFactory.createUser();
    const response = await supertest(app)
      .post("/auth/sign-in")
      .send(userFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/auth/sign-in")
      .send(userFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 401 for user not found", async() => {
    const response = await supertest(app)
      .post("/auth/sign-in")
      .send(userFactory.getValidBody());
    expect(response.status).toBe(401);
  });
});
