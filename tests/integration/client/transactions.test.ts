import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../../src/app";

import Session from "../../../src/entities/Session";
import User from "../../../src/entities/User";

import * as userFactory from "../../factories/user.factory";
import * as sessionFactory from "../../factories/session.factory";
import * as enrollmentFactory from "../../factories/enrollment.factory";
import * as accountFactory from "../../factories/account.factory";
import * as transactionFactory from "../../factories/transaction.factory";
import { clearDatabase, clearTable } from "../../utils/database";
import Transaction from "../../../src/entities/Transaction";
import Account from "../../../src/entities/Account";
import AccountData from "../../../src/interfaces/account";

describe("POST /transactions/deposit", () => {
  let user: User;
  let session: Session;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
    await enrollmentFactory.createEnrollment(user);
    await accountFactory.createAccount(user);
  });
  
  beforeEach(async() => {
    await clearTable(Transaction);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    const response = await supertest(app)
      .post("/transactions/deposit")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/transactions/deposit")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
});

describe("POST /transactions/withdraw", () => {
  let user: User;
  let session: Session;
  let account: Account;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
    await enrollmentFactory.createEnrollment(user);
    account = await accountFactory.createAccount(user);
  });
  
  beforeEach(async() => {
    await clearTable(Transaction);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    await transactionFactory.changeBalance(account, 0.01);
    const response = await supertest(app)
      .post("/transactions/withdraw")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/transactions/withdraw")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 400 for not enough balance", async() => {
    await transactionFactory.changeBalance(account, 0);
    const response = await supertest(app)
      .post("/transactions/withdraw")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getValidBody());
    expect(response.status).toBe(400);
  });
});

describe("POST /transactions/transafer", () => {
  let user: User;
  let session: Session;
  let account: Account;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
    await enrollmentFactory.createEnrollment(user);
    await accountFactory.createAccount(user);
    account = await accountFactory.createAccount(
      user, 
      { 
        number: "11111-1", 
        agency: "1111" 
      } as AccountData 
    );
  });
  
  beforeEach(async() => {
    await clearTable(Transaction);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    await transactionFactory.changeBalance(account, 0.01);
    const response = await supertest(app)
      .post(`/transactions/transfer/${account.id}`)
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post(`/transactions/transfer/${account.id}`)
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 400 for not enough balance", async() => {
    await transactionFactory.changeBalance(account, 0);
    const response = await supertest(app)
      .post(`/transactions/transfer/${account.id}`)
      .set({ Authorization: `Bearer ${session.token}` })
      .send(transactionFactory.getValidBody());
    expect(response.status).toBe(400);
  });
});
