import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../../src/app";

import Account from "../../../src/entities/Account";
import Session from "../../../src/entities/Session";
import User from "../../../src/entities/User";

import * as userFactory from "../../factories/user.factory";
import * as sessionFactory from "../../factories/session.factory";
import * as enrollmentFactory from "../../factories/enrollment.factory";
import * as accountFactory from "../../factories/account.factory";
import { clearDatabase, clearTable } from "../../utils/database";

describe("POST /accounts", () => {
  let user: User;
  let session: Session;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
    await enrollmentFactory.createEnrollment(user);
  });
  
  beforeEach(async() => {
    await clearTable(Account);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    const response = await supertest(app)
      .post("/accounts")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(accountFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/accounts")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(accountFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 409 for account unavaible", async() => {
    const otherUser = await userFactory.createUser();
    await accountFactory.createAccount(otherUser);
    const response = await supertest(app)
      .post("/accounts")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(accountFactory.getValidBody());
    expect(response.status).toBe(409);
  });
});

describe("GET /enrollments", () => {
  let user: User;
  let session: Session;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
  });
  
  beforeEach(async() => {
    await clearTable(Account);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer expected body for success", async() => {
    const account = await accountFactory.createAccount(user);
    const response = await supertest(app)
      .get("/accounts")
      .set({ Authorization: `Bearer ${session.token}` });
    expect(response.body).toEqual([{
      ...account,
      createdAt: expect.any(String)
    }]);
  });
});
