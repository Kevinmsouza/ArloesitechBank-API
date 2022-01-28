import supertest from "supertest";
import { getConnection } from "typeorm";
import app, { init } from "../../../src/app";

import Address from "../../../src/entities/Address";
import Enrollment from "../../../src/entities/Enrollment";
import Session from "../../../src/entities/Session";
import User from "../../../src/entities/User";

import * as userFactory from "../../factories/user.factory";
import * as sessionFactory from "../../factories/session.factory";
import * as enrollmentFactory from "../../factories/enrollment.factory";
import { clearDatabase, clearTable } from "../../utils/database";

describe("POST /enrollments", () => {
  let user: User;
  let session: Session;

  beforeAll(async() => {
    await init();
    await clearDatabase();
    user = await userFactory.createUser();
    session = await sessionFactory.createSession(user);
  });
  
  beforeEach(async() => {
    await clearTable(Address);
    await clearTable(Enrollment);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer status 200 for success", async() => {
    const response = await supertest(app)
      .post("/enrollments")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(enrollmentFactory.getValidBody());
    expect(response.status).toBe(200);
  });
  it("should answer status 422 for invalid body", async() => {
    const response = await supertest(app)
      .post("/enrollments")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(enrollmentFactory.getInvalidBody());
    expect(response.status).toBe(422);
  });
  it("should answer status 409 for cpf unavailable", async() => {
    const otherUser = await userFactory.createUser();
    enrollmentFactory.createEnrollment(otherUser);
    const response = await supertest(app)
      .post("/enrollments")
      .set({ Authorization: `Bearer ${session.token}` })
      .send(enrollmentFactory.getValidBody());
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
    await clearTable(Address);
    await clearTable(Enrollment);
  });
  
  afterAll(async() => {
    await clearDatabase();
    await getConnection().close();
  });

  it("should answer expected body for success", async() => {
    const enrollment = await enrollmentFactory.createEnrollment(user);
    const response = await supertest(app)
      .get("/enrollments")
      .set({ Authorization: `Bearer ${session.token}` });
    expect(response.body).toEqual({ 
      ...enrollment,
      address: {
        ...enrollment.address,
        id: expect.any(Number),
        enrollmentId: enrollment.id
      }
    });
  });
});
