import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import Session from "../../src/entities/Session";
import User from "../../src/entities/User";

export async function createSession(user: User) {
  const token = jwt.sign({
    userId: user.id
  }, process.env.JWT_SECRET);

  const session = getRepository(Session).create({ userId: user.id, token });

  await getRepository(Session).save(session);
  return session;
}
